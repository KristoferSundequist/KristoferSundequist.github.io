import {Game} from './game/Game';
import * as tf from '@tensorflow/tfjs';
import {getActor, getCritic} from './model';
import {GAE} from './gae';

tf.setBackend('cpu');

const actor = getActor(5,4);
const critic = getCritic(4);
const canvas_width = 1800;
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

async function train(actors, episodeSize)
{
    
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