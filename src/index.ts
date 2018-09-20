import {Game} from './game/Game';
import * as tf from '@tensorflow/tfjs';
import {getActor, getCritic} from './model';
import {GAE} from './gae';

tf.setBackend('cpu');

const optimizer: any = tf.train.adam(0.0003);
const actor = getActor(5,4);
const critic = getCritic(4);
const canvas_width = 900;
const canvas_height = 900;

const canv=document.createElement("canvas");
const context = canv.getContext("2d");
canv.id = "canvasID";
canv.height = canvas_height;
canv.width = canvas_width;
canv.style.border = "thick solid black";
document.body.appendChild(canv);

async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// do in separate worker process
async function getEpisode(iters: number, actor, critic): Promise<{states, actionprobs, values, actions, rewards}>
{
    const t1 = performance.now()
    const g = new Game(context, canvas_width, canvas_height);
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
      
        const a = await action.data()
        const reward = g.step(a[0])

        states.push(state)
        actionprobs.push(probs)
        values.push(value)
        actions.push(action)
        rewards.push(reward)
    }

    const t2 = performance.now()
    const return_obj = tf.tidy(() => {
        return {
            states: tf.concat(states),
            actionprobs: tf.concat(actionprobs),
            values: tf.concat(values).squeeze(),
            actions: tf.concat(actions).squeeze(),
            rewards: rewards
        }
    })
    console.log("concat:", performance.now()-t2)

    states.map(x => x.dispose());
    actionprobs.map(x => x.dispose());
    values.map(x => x.dispose());
    actions.map(x => x.dispose());

    console.log(performance.now() - t1);
    return return_obj
}

//train(7, 1, 20000, 5, 0.01, 0.2,0.001,4000)
async function train(episodes: number, actors: number, episodeSize: number, epochs: number, beta: number, epsilon: number, lr: number, batch_size: number)
{
    for(let i = 0; i < episodes; i++)
    {
        // for actors ... | concat
        const ep = await getEpisode(episodeSize, actor, critic)

        let v = await ep.values.data();
        v = Array.from(v);
        let advantages = await GAE(ep.rewards, v);
        let advantages2 = tf.tensor(advantages);
        const reward_sum = ep.rewards.reduce((acc, v) => acc + v, 0);
        console.log("Episode:", i/episodes, "Reward/EpisodeSize:",reward_sum/episodeSize)

        ppo(ep.states, ep.actionprobs, ep.actions, ep.values, advantages2, epochs, beta, epsilon, lr, batch_size, actor, critic)
    }
}

function normalize(tensor)
{
    return tf.tidy(() => {
        const centered = tensor.sub(tensor.mean())
        const std = centered.square().mean().sqrt()
        const t_normalized = centered.div(std)
        return t_normalized
    })
}
function badGather(tensor, indices)
{

    return tf.tidy(() => {
        return tensor.mul(tf.oneHot(indices, tensor.shape[1]).cast('float32')).sum(1)
    })
}

function printer(msg,t)
{
    console.log("----------------------", msg, "-------------------")
    console.log(t)
    console.log(t.shape)
    t.print()

}

function ppo(states, actionprobs, actions, values, advantages, epochs, beta, epsilon, lr, batch_size, actor, critic)
{
    //printer("states", states)
    //printer("actionprobs", actionprobs)
    //printer("actions", actions)
    //printer("values", values)
    //printer("advantages", advantages)


    tf.tidy(() => {
        const returns = values.add(advantages)
        //printer("returns", returns)
        const norm_advantages = normalize(advantages)
        //printer("norm_advantages", norm_advantages)

        const old_taken_action_probs = badGather(actionprobs, actions)
        //printer("old_taken_action_probs", old_taken_action_probs)

        for(let i = 0; i < epochs; i++)
        {
            tf.tidy(() => {
                const indices = tf.randomUniform([batch_size], 0, states.shape[0], 'int32')
                //printer("indices", indices)
                const states_batch = states.gather(indices)
                //printer("states_batch", states_batch)
                const action_batch = actions.gather(indices)
                //printer("action_batch", action_batch)
                const old_taken_actionprobs_batch = old_taken_action_probs.gather(indices)
                //printer("old_taken_actionprobs_batch", old_taken_actionprobs_batch)
                const advantage_batch = norm_advantages.gather(indices)
                //printer("advantage_batch", advantage_batch)
                const returns_batch = returns.gather(indices)
                //printer("returns_batch", returns_batch)

                optimizer.minimize(() => {
                    const new_actionprobs = actor.predict(states_batch)
                    //printer("new_actionprobs", new_actionprobs)
                    const new_taken_actionprobs = badGather(new_actionprobs, action_batch)
                    //printer("new_taken_actionprobs", new_taken_actionprobs)
                    const entropy = tf.sum(actionprobs.mul(actionprobs.add(1e-08).log()), 1).neg().mean()
                    //printer("entropy", entropy)
                    const ratio = new_taken_actionprobs.div(old_taken_actionprobs_batch)
                    //printer("ratio", ratio)
                    const surr1 = ratio.mul(advantage_batch)
                    //printer("surr1", surr1)
                    const surr2 = tf.clipByValue(ratio, 1-epsilon, 1+epsilon).mul(advantage_batch)
                    //printer("surr2", surr2)
                    let action_loss = tf.minimum(surr1, surr2).mean().neg()
                    //printer("action_loss", action_loss)
                    action_loss = action_loss.sub(entropy.mul(beta))
                    //printer("action_loss (2)", action_loss)

                    //console.log("Action loss:")
                    //action_loss.print()

                    const new_values = critic.predict(states_batch).squeeze()
                    //printer("new_values", new_values)
                    const value_loss = tf.losses.meanSquaredError(returns_batch, new_values)
                    //printer("value_loss", value_loss)

                    //console.log("Value loss:")
                    //value_loss.print()

                    const loss = action_loss.add(value_loss)
                    //printer("loss", loss)

                    return loss
                })
            })
        }
    })
    states.dispose()
    actionprobs.dispose()
    actions.dispose()
    values.dispose()
    advantages.dispose()
}


async function agent_loop(iters)
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

(<any>window).tf = tf;
(<any>window).actor = actor;
(<any>window).critic = critic;
(<any>window).getEpisode = getEpisode;
(<any>window).agent_loop = agent_loop;
(<any>window).GAE = GAE;
(<any>window).train = train;
(<any>window).normalize = normalize;
