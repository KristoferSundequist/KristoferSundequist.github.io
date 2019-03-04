import {Game} from './../games/simple_game/Game'
import * as tf from '@tensorflow/tfjs';
import {getActor, getCritic} from './model';
import {GAE, Discount} from './gae';
import {IGame} from './../IGame'
import {sleep} from '../Utils'
import {context, canvas_width, canvas_height} from './../index'

tf.setBackend('cpu')
export const tfMemory = () => console.log(tf.memory())
export const tff = tf
export const gae = GAE

export const optimizer_pi: any = tf.train.adam(0.0003,0.9,0.999,1e-05);
export const optimizer_vf: any = tf.train.adam(0.001,0.9,0.999,1e-05);
export let actor = getActor(Game.action_space_size, Game.state_space_size);
export let critic = getCritic(Game.state_space_size);

//const w = BuildWorker(Calc)
//w.onmessage = e => console.log(e.data)
//w.postMessage(3)

// do in separate worker process
export function getEpisode(iters: number, actor, critic): {states, actionprobs, values, actions, rewards, advantages, discounted_rewards}
{
    return tf.tidy(() => {
        const g : IGame = new Game(context, canvas_width, canvas_height);
        const states = []
        const actionprobs = []
        const values = []
        const actions = []
        const rewards = []

        for(let i = 0; i < iters; i++)
        {
            const state = tf.tensor([g.getState()])
            const probs = actor.predict(state)
            const value = critic.predict(state)
            const action = tf.multinomial(probs, 1, Math.random(), true)        
            const a = action.dataSync()
            const reward = g.step(a[0])

            states.push(state)
            actionprobs.push(probs)
            values.push(value)
            actions.push(action)
            rewards.push(reward)
        }

        const valuesFixed = tf.concat(values).squeeze()
        let v = valuesFixed.dataSync();    
        v = Array.from(v);
        let advantages = GAE(rewards, v);
        const discounted_rewards = Discount(rewards, .99, v[v.length-1])

        return {
            states: tf.concat(states),
            actionprobs: tf.concat(actionprobs),
            values: valuesFixed,
            actions: tf.concat(actions).squeeze(),
            rewards: rewards,
            advantages: tf.tensor(advantages),
            discounted_rewards: tf.tensor(discounted_rewards)
        }
    })
}

//train(7, 10, 6000, 10, 0.02, 0.1, 4000)
export function train(episodes: number, actors: number, episodeSize: number, epochs: number, beta: number, epsilon: number, batch_size: number)
{
    for(let i = 0; i < episodes; i++)
    {
        tf.tidy(() => {
            // for actors ... | concat
            const t1 = performance.now()
            
            let states = []
            let actionprobs = []
            let actions = []
            let values = []
            let advantages = []
            let rewards = []
            let dr = []

            for(let i = 0; i < actors; i++) {
                const ep = getEpisode(episodeSize, actor, critic)
                
                states.push(ep.states)
                actionprobs.push(ep.actionprobs)
                actions.push(ep.actions)
                values.push(ep.values)
                rewards.push(ep.rewards)
                advantages.push(ep.advantages)
                dr.push(ep.discounted_rewards)
            }

            states = tf.concat(states)
            actionprobs = tf.concat(actionprobs)
            actions = tf.concat(actions)
            values = tf.concat(values)
            advantages = tf.concat(advantages)
            rewards = (rewards as any).flat()
            dr = tf.concat(dr)

            const reward_sum = rewards.reduce((acc, v) => acc + v, 0);

            console.log("get episode time:", performance.now()-t1)
            console.log("Episode:", i, "/", episodes, "Reward/EpisodeSize:",reward_sum/(episodeSize*actors))
            const t2 = performance.now()
            ppo(states, actionprobs, actions, values, advantages, dr, epochs, beta, epsilon, batch_size, actor, critic)
            console.log("train time:", performance.now()-t2)
        })
    }
}

export function normalize(tensor)
{
    return tf.tidy(() => {
        const centered = tensor.sub(tensor.mean())
        const std = centered.square().mean().sqrt()
        const t_normalized = centered.div(std.add(1e-08))
        return t_normalized
    })
}
export function badGather(tensor, indices)
{

    return tf.tidy(() => {
        return tensor.mul(tf.oneHot(indices, tensor.shape[1]).cast('float32')).sum(1)
    })
}

export function printer(msg,t)
{
    console.log("----------------------", msg, "-------------------")
    console.log(t)
    console.log(t.shape)
    t.print()

}

export function getIndices(n, max)
{
    const inds = new Set
    while(inds.size < n)
    {
        inds.add(Math.random()*max << 0)
    }
    return tf.tensor(Array.from(inds)).cast('int32')
}

export function ppo(states, actionprobs, actions, values, advantages, discounted_rewards, epochs, beta, epsilon, batch_size, actor, critic)
{
    tf.tidy(() => {
        //const returns = values.add(advantages)
        const returns = discounted_rewards
        //const norm_advantages = normalize(advantages)
        //const norm_advantages = discounted_rewards.sub(values)
        const norm_advantages = normalize(discounted_rewards.sub(values))
        //const norm_advantages = discounted_rewards.sub(values)
        //const returns = discounted_rewards
        //const norm_advantages = normalize(discounted_rewards)

        //const returns = discounted_rewards;
        //const norm_advantages = normalize(advantages);

        const old_taken_action_probs = badGather(actionprobs, actions)

        for(let i = 0; i < epochs; i++)
        {
                //const indices = tf.randomUniform([batch_size], 0, states.shape[0], 'int32')
                const indices = getIndices(batch_size, states.shape[0])
                const states_batch = states.gather(indices)
                const action_batch = actions.gather(indices)
                const old_taken_actionprobs_batch = old_taken_action_probs.gather(indices)
                const advantage_batch = norm_advantages.gather(indices)
                const returns_batch = returns.gather(indices)
                const values_batch = values.gather(indices)
                
                optimizer_pi.minimize(() => {
                    /////////////////
                    // ACTION LOSS //
                    /////////////////
                    const new_actionprobs = actor.predict(states_batch)
                    const new_taken_actionprobs = badGather(new_actionprobs, action_batch)
                    const entropy = tf.sum(new_actionprobs.mul(new_actionprobs.add(1e-08).log()), 1).neg().mean().mul(beta)
                    const ratio = new_taken_actionprobs.div(old_taken_actionprobs_batch)
                    const surr1 = ratio.mul(advantage_batch)
                    const surr2 = tf.clipByValue(ratio, 1-epsilon, 1+epsilon).mul(advantage_batch)
                    const action_loss_surr = tf.minimum(surr1, surr2).mean().neg() //memory leak
                    const action_loss = action_loss_surr.sub(entropy)
                    return action_loss
                })
                
                optimizer_vf.minimize(() => {
                    ////////////////
                    // VALUE LOSS //
                    ////////////////
                    const new_values = critic.predict(states_batch).squeeze()
                    const value_loss1 = new_values.sub(returns_batch).pow(2)
                    const clipped = values_batch.add(tf.clipByValue(new_values.sub(values_batch), -epsilon, epsilon))
                    const value_loss2 = clipped.sub(returns_batch).pow(2)
                    const value_loss = tf.maximum(value_loss1, value_loss2).mean().mul(tf.scalar(0.5)) //memory leak
                    return value_loss
                })
                
                
        }
    })
}


export async function agent_loop(iters)
{
    const g = new Game(context, canvas_width, canvas_height);
    
    for(let i = 0; i < iters; i++)
    {
        const state = tf.tensor([g.getState()])
        const probs = actor.predict(state)
        const value = critic.predict(state)
        const action = tf.multinomial(probs, 1, Math.random(), true)
        
        const a = await action.data()
        const reward = g.step(a[0])

        g.render()
        const v = await value.data()
        context.font = "40px Arial"
        context.fillStyle = "Black"
        context.fillText(v[0], 100, 100)

        await sleep(10)

        state.dispose()
        probs.dispose()
        value.dispose()
        action.dispose()
    }
}

export async function loadIndexed(actorstring: string, criticstring: string): Promise<void>
{
    actor = await tf.loadModel(`indexeddb://${actorstring}`);
    critic = await tf.loadModel(`indexeddb://${criticstring}`);
    (<any>window).actor = actor;
    (<any>window).critic = critic;  
}

export async function saveIndexed(actorstring: string, criticstring: string): Promise<void> 
{
    await (<any>actor).save(`indexeddb://${actorstring}`)
    await (<any>critic).save(`indexeddb://${criticstring}`)
}