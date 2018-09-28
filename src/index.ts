import {Game} from './game/Game';
import * as tf from '@tensorflow/tfjs';
import {getActor, getCritic} from './model';
import {GAE} from './gae';

tf.setBackend('cpu');


const optimizer: any = tf.train.adam(0.0001);
let actor = getActor(5,6);
let critic = getCritic(6);
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

    const return_obj = tf.tidy(() => {
        return {
            states: tf.concat(states),
            actionprobs: tf.concat(actionprobs),
            values: tf.concat(values).squeeze(),
            actions: tf.concat(actions).squeeze(),
            rewards: rewards
        }
    })

    states.map(x => x.dispose());
    actionprobs.map(x => x.dispose());
    values.map(x => x.dispose());
    actions.map(x => x.dispose());

    return return_obj
}

//train(7, 1, 10000, 8, 0.01, 0.1,0.001,4000)
async function train(episodes: number, actors: number, episodeSize: number, epochs: number, beta: number, epsilon: number, lr: number, batch_size: number)
{
    for(let i = 0; i < episodes; i++)
    {
        // for actors ... | concat
        const t1 = performance.now()
        const ep = await getEpisode(episodeSize, actor, critic)
        let v = await ep.values.data();
        v = Array.from(v);
        let advantages = await GAE(ep.rewards, v);
        let advantages2 = tf.tensor(advantages);
        const reward_sum = ep.rewards.reduce((acc, v) => acc + v, 0);
        console.log("get episode time:", performance.now()-t1)
        console.log("Episode:", i, "/", episodes, "Reward/EpisodeSize:",reward_sum/episodeSize)
        const t2 = performance.now()
        ppo(ep.states, ep.actionprobs, ep.actions, ep.values, advantages2, epochs, beta, epsilon, lr, batch_size, actor, critic)
        console.log("train time:", performance.now()-t2)
        ep.states.dispose()
        ep.actionprobs.dispose()
        ep.actions.dispose()
        ep.values.dispose()
        advantages2.dispose()
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
    tf.tidy(() => {
        const returns = values.add(advantages)
        const norm_advantages = normalize(advantages)
        const old_taken_action_probs = badGather(actionprobs, actions)

        for(let i = 0; i < epochs; i++)
        {
            tf.tidy(() => {
                const indices = tf.randomUniform([batch_size], 0, states.shape[0], 'int32')
                const states_batch = states.gather(indices)
                const action_batch = actions.gather(indices)
                const old_taken_actionprobs_batch = old_taken_action_probs.gather(indices)
                const advantage_batch = norm_advantages.gather(indices)
                const returns_batch = returns.gather(indices)
                const values_batch = values.gather(indices)
                
                optimizer.minimize(() => {
                    /////////////////
                    // ACTION LOSS //
                    /////////////////
                    const new_actionprobs = actor.predict(states_batch)
                    const new_taken_actionprobs = badGather(new_actionprobs, action_batch)
                    const entropy = tf.sum(actionprobs.mul(actionprobs.add(1e-08).log()), 1).neg().mean()
                    const ratio = new_taken_actionprobs.div(old_taken_actionprobs_batch)
                    const surr1 = ratio.mul(advantage_batch)
                    const surr2 = tf.clipByValue(ratio, 1-epsilon, 1+epsilon).mul(advantage_batch)
                    const action_loss_surr = tf.minimum(surr1, surr2).mean().neg() //memory leak
                    const action_loss = action_loss_surr.sub(entropy.mul(beta))
                    return action_loss
                })
                
                
                optimizer.minimize(() => {
                    ////////////////
                    // VALUE LOSS //
                    ////////////////
                    const new_values = critic.predict(states_batch).squeeze()
                    const value_loss1 = new_values.sub(returns_batch).pow(2)
                    const clipped = values_batch.add(tf.clipByValue(new_values.sub(values_batch), -epsilon, epsilon))
                    const value_loss2 = clipped.sub(returns_batch).pow(2)
                    const value_loss = tf.maximum(value_loss1, value_loss2).mean() //memory leak
                    return value_loss
                    /////////////
                    // COMBINE //
                    /////////////
                    //const loss = action_loss.add(value_loss.mul(0.5))
                    
                    //return value_loss
                })
                
                
            })
        }
    })
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

async function loadModels() 
{
    const jsonUpload = <HTMLInputElement>(document.getElementsByName('json-upload')[0]);
    const weightsUpload = <HTMLInputElement>(document.getElementsByName('weights-upload')[0]);
    console.log(jsonUpload);
    actor = await tf.loadModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
    
    const jsonUpload2 = <HTMLInputElement>(document.getElementsByName('json-upload2')[0]);
    const weightsUpload2 = <HTMLInputElement>(document.getElementsByName('weights-upload2')[0]);
    critic = await tf.loadModel(tf.io.browserFiles([jsonUpload2.files[0], weightsUpload2.files[0]]));
}

function printWeights() {
        
}

async function loadIndexed(actorstring: string, criticstring: string): Promise<void>
{
    actor = await tf.loadModel(`indexeddb://${actorstring}`);
    critic = await tf.loadModel(`indexeddb://${criticstring}`);
    (<any>window).actor = actor;
    (<any>window).critic = critic;  
}

async function saveIndexed(actorstring: string, criticstring: string): Promise<void> 
{
    await (<any>actor).save(`indexeddb://${actorstring}`)
    await (<any>critic).save(`indexeddb://${criticstring}`)
}

(<any>window).saveIndexed = saveIndexed;
(<any>window).loadIndexed = loadIndexed;
(<any>window).printWeights = printWeights;
(<any>window).loadModels = loadModels;
(<any>window).tf = tf;
(<any>window).actor = actor;
(<any>window).critic = critic;
(<any>window).getEpisode = getEpisode;
(<any>window).agent_loop = agent_loop;
(<any>window).GAE = GAE;
(<any>window).train = train;
(<any>window).normalize = normalize;
(<any>window).optimizer = optimizer;
