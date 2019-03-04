import Genome from './Genome'
//import {Game} from './../games/game_enemy_slide/Game'
import {Game} from './../games/simple_game/Game'
import {context, canvas_width, canvas_height} from './../index'
import Population from './Population'
import * as Utils from './../Utils'

//declare var require: any
//const neataptic = require('neataptic')
import * as neataptic from 'neataptic'
export const neataptic2 = neataptic

export const genome = Genome
export const utils = Utils

export const pop = new Population(150, Game.state_space_size, Game.action_space_size)

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
        await Utils.sleep(10)
    }
}

export const xor_pop = new Population(150, 2, 2)
export const xor_paper = new Population(150, 2, 1)

export function xor_fitness_paper(agent: Genome, iters = 1)
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    const labels = [0,1,1,0]

    const totalDistance = inp.reduce((sum,cur,i) => sum + Math.abs(Utils.Sigmoid(agent.forward(cur)[0]) - labels[i]), 0)
    return (4-totalDistance)**2
}

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

export function eval_paper(agent: Genome): void
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    console.log(inp.map(v => Utils.Sigmoid(agent.forward(v)[0])))
}


/*
neat.pop.evalPop(6000, neat.fitness, 4)
for(let i = 0; i < 100; i++)
{
    const t = performance.now()
    neat.pop.nextGeneration(6000, neat.fitness, 4, 0.05, 0.03, 0.1, 0.8, 0.5, 15)
    console.log("Elapsed time:", performance.now() - t)
}
*/

/*
neat.xor_pop.evalPop(1, neat.xor_fitness, 4)
for(let i = 0; i < 100; i++)
{
    const t = performance.now()
    neat.xor_pop.nextGeneration(1, neat.xor_fitness, 4, 0.05, 0.03, 0.1, 0.8, 0.5, 15)
    console.log("Elapsed time:", performance.now() - t)
}
*/

/*
neat.xor_pop.evalPopNoSpecies(1, neat.xor_fitness)
for(let i = 0; i < 100; i++)
{
    const t = performance.now()
    neat.xor_pop.nextGenerationNoSpecies(1, neat.xor_fitness, 0.1, 0.05, 0.1, 0.8, 0.3)
    console.log("Elapsed time:", performance.now() - t)
}
*/











/*


neat.xor_pop.evalPop(1, neat.xor_fitness, 4)
for(let i = 0; i < 50; i++)
{
    const t = performance.now()
    neat.xor_pop.nextGeneration(1, neat.xor_fitness, 4, 0.2, 0.05, 0.1, 0.8, 0.3, 15)
    console.log("Elapsed time:", performance.now() - t)
}

*/











/*
for(let i = 0; i < 100; i++)
{
    const t = performance.now()
    neat.pop.nextGeneration(6000, neat.fitness, 5, 0.2, 0.05, 0.1, 0.8, 0.2, 15)
    console.log("Elapsed time:", performance.now() - t)
}


*/

/*


neat.xor_pop.evalPop(1, neat.xor_fitness, 1.5)
for(let i = 0; i < 100; i++)
{
    const t = performance.now()
    neat.xor_pop.nextGeneration(1, neat.xor_fitness, 1.5, 0.2, 0.1, 0.1, 0.8, 0.2, 15)
    console.log("Elapsed time:", performance.now() - t)
}

*/


export function forward(g, v)
{
    g.clear()
    return Utils.Sigmoid(g.activate(v)[0])
}
export function fitness123(g)
{
    const inp = [[0,0],[1,0],[0,1],[1,1]]
    const labels = [0,1,1,0]

    const totalDistance = inp.reduce((sum,cur,i) => sum + Math.abs(forward(g,cur) - labels[i]), 0)
    return (4-totalDistance)**2
}

export const getIndexOfMax = v =>
    v.reduce((biggest, v, i) => v > biggest[0] ? [v, i] : biggest, [-9999,0])[1]

export function forwardMax(g,v) : number
{
    const outs = g.activate(v)
    return getIndexOfMax(outs)
}

export function neatfitness(genome)
{
    const iters = 20000
    let g = new Game(context, canvas_width, canvas_height);
    let reward = 0
    for(let i = 0; i < iters; i++)
    {
        const state = g.getState()
        //const a = Utils.multinomial(Utils.softmax(genome.activate(state)))
        const a = forwardMax(genome, state)
        reward += g.step(a)
    }
    return reward/iters
}

export const neat = new neataptic.Neat(
    Game.state_space_size,
    Game.action_space_size,
    neatfitness,
    {
        popsize: 1000,
        elitism: 10,
        mutation: neataptic.methods.mutation.ALL,
        network: neataptic.architect.Random(
            Game.state_space_size,
            2,
            Game.action_space_size,
        ),
        mutationRate: 0.8,
        clear: true
    }
)

export async function neat_loop(genome, iters: number)
{
    const g = new Game(context, canvas_width, canvas_height);
    
    for(let i = 0; i < iters; i++)
    {
        const state = g.getState()
        //const a = Utils.multinomial(Utils.softmax(genome.activate(state)))
        const a = forwardMax(genome, state)
        const reward = g.step(a)
        g.render()
        await Utils.sleep(10)
    }
}

export async function neat_train_loop(iters: number){
    let best = neat.population[0]
    for(let i = 0; i < iters; i++)
    {
        best = await neat.evolve()
        console.log("Completion:", i/iters, "Best score:", best.score)
    }
}
