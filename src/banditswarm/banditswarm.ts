import {Game} from './../games/simple_game/Game'
import * as tf from '@tensorflow/tfjs';
import {Model} from './model';
import {IGame} from './../IGame'
import {sleep} from '../Utils'
import {context, canvas_width, canvas_height} from './../index'

tf.setBackend('cpu')
export const tfMemory = () => console.log(tf.memory())
export const tff = tf

export const model = new Model(Game.action_space_size, Game.state_space_size, 16)

export function train(iters: number, decay: number, epsilon: number)
{
    let g = new Game(context, canvas_width, canvas_height);
    let reward_count = 0
    let reward_log = []
    let time = performance.now()
    for(let i = 0; i < iters; i++)
    {
        const action = (Math.random() < epsilon) ? (Math.random()*Game.action_space_size << 0) : model.act_softmax(g.getState())
        const reward = g.step(action)
        model.update(reward*100, decay)

        reward_count += reward
        if (i != 0 && i % 3000 == 0) {
            const new_time = performance.now()
            g = new Game(context, canvas_width, canvas_height);
            reward_log.push(reward_count)
            console.log((i/iters)*100, "%", "reward:", reward_count, "time elapsed:", new_time - time)

            time = new_time
            reward_count = 0
        }
    }
}

export async function agent_loop(iters: number, epsilon: number = 0)
{
    const g = new Game(context, canvas_width, canvas_height);
    
    for(let i = 0; i < iters; i++)
    {
        const action = (Math.random() < epsilon) ? (Math.random()*Game.action_space_size << 0) : model.act_softmax(g.getState())
        const reward = g.step(action)

        g.render()
        await sleep(10)
    }
}