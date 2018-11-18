import Genome from './Genome'
import {Game} from './../games/simple_enemy/Game';
import {sleep} from '../common'
import {context, canvas_width, canvas_height} from './../index'
import Population from './Population'
import * as Utils from './Utils'

export const genome = Genome
export const utils = Utils

export const pop = new Population(1000, Game.state_space_size, Game.action_space_size)

export function fitness(agent: Genome, iters: number)
{
    let g = new Game(context, canvas_width, canvas_height);
    let reward = 0
    for(let i = 0; i < iters; i++)
    {
        const state = g.getState()
        const a = agent.getActionSoftmax(state)
        reward += g.step(a)
        if (i % 3000 === 0) 
            g = new Game(context, canvas_width, canvas_height);
    }
    return reward
}

export async function agent_loop(agent: Genome, iters: number)
{
    const g = new Game(context, canvas_width, canvas_height);
    
    for(let i = 0; i < iters; i++)
    {
        const state = g.getState()
        const a = agent.getActionSoftmax(state)
        const reward = g.step(a)
        g.render()
        await sleep(10)
    }
}

/*
for(let i = 0; i < 10; i++)
{
    const t = performance.now()
    neat.pop.nextGeneration(6000, neat.fitness, 4, 0.1, 0.05, 0.2, 0.8, 0.4, 15)
    console.log("Elapsed time:", performance.now() - t)
}
*/

export const xor_pop = new Population(1000, 2, 2)

export function xor_fitness(agent: Genome, iters = 1)
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    const labels = [0,1,1,0]

    let error = 0
    inp.forEach((v, i) => {
        const output = agent.copy().getSoftmax(v)
        error += -Math.log(output[labels[i]])
    })
    return -error
}

export function xor_fitness_hard(agent: Genome, iters = 1)
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    const labels = [0,1,1,0]

    let rewards = 0
    inp.forEach((v, i) => {
        const a = agent.copy().getAction(v)
        if(a == labels[i])
        {
            rewards++
        }
        else 
        {
            rewards--
        }
    })
    return rewards
}

export function eval_xor(agent: Genome): void
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    console.log(inp.map(v => agent.copy().getSoftmax(v)))
    console.log(inp.map(v => agent.copy().getAction(v)))
    console.log(inp.map(v => agent.copy().forward(v)))
}

/*
neat.xor_pop.evalPop(1, neat.xor_fitness, 4)
for(let i = 0; i < 10; i++)
{
    const t = performance.now()
    neat.xor_pop.nextGeneration(1, neat.xor_fitness, 4, 0.1, 0.05, 0.1, 0.8, 0.5, 15)
    console.log("Elapsed time:", performance.now() - t)
}
*/
