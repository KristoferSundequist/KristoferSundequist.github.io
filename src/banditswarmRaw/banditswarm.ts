import {Game} from './../games/super_simple_game/Game'
import {IGame} from './../IGame'
import {sleep} from '../Utils'
import {context, canvas_width, canvas_height} from './../index'
import { Model } from './Model';
import { Logger } from './../Logger'

export const model = new Model(Game.state_space_size, Game.action_space_size, 16)
export const logger = new Logger(0.99)

export function train(iters: number, decay: number, epsilon: number = 0)
{
    let g = new Game(context, canvas_width, canvas_height);
    let reward_count = 0
    let time = performance.now()

    for(let i = 0; i < iters; i++)
    {
        const action = model.act_softmax(g.getState())
        const reward = g.step(action)
        model.update(reward, decay)

        reward_count += reward
        if (i != 0 && i % 500 == 0) {
            const new_time = performance.now()
            g = new Game(context, canvas_width, canvas_height);
            logger.push(reward_count)
            console.log(
                (i/iters)*100, "%",
                "reward:", reward_count,
                "time elapsed:", new_time - time,
                "running avg reward:", logger.getRunningAvg()
            )

            time = new_time
            reward_count = 0
        }
    }
}

export async function agent_loop(iters: number, verbose: boolean = false, sleepTime: number = 10)
{
    const g = new Game(context, canvas_width, canvas_height);
    
    for(let i = 0; i < iters; i++)
    {
        const action = model.act_softmax(g.getState())
        const reward = g.step(action)
        if (verbose) {
            console.log(reward)
        }

        g.render()
        await sleep(sleepTime)
    }
}