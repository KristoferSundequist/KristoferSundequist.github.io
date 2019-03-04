import Genome from './Genome'
import Species from './Species'
import {InnovationNumberGenerator} from './InnovationNumberGenerator'
import {randomKey, uniformRandom, Sigmoid} from './../Utils'
import { Connection } from './Connection';
import { fitness } from './neat';

export default class Population {
    members: Genome[]
    species: Species[]
    popSize: number
    nInp: number
    nOut: number
    ing: InnovationNumberGenerator
    best: Genome
    meanFitness: number

    constructor(popSize: number, nInp: number, nOut: number) 
    {
        this.popSize = popSize
        this.nInp = nInp
        this.nOut = nOut
        this.ing = new InnovationNumberGenerator(this.nInp+this.nOut)
        this.species = []
        this.members = this.generateInitialPopulation()
        this.addRandomConnections(this.members, 1)
        this.best = null
        this.meanFitness = 0
    }

    //new node = 0.03
    //new connection = 0.5
    //weightperterbProb = 0.8
    nextGeneration(
        iters: number, 
        fitnessFunction: (g: Genome, i: number) => number, 
        speciesThreshold: number,
        newConnectionProb: number,
        newNodeProb: number,
        weightPerturbAmount: number,
        weightPerturbProb: number,
        survivalRate: number,
        stagnationThreshold: number
        )
    {
        this.removeBadGenomes(survivalRate, stagnationThreshold, () => {
            this.members = this.members.splice(0, this.members.length*survivalRate << 0)
            this.members.forEach(m => m.alive = true)
            this.species = []
            this.evalPop(iters, fitnessFunction, speciesThreshold)
        })
        let newPop: Genome[] = [this.best.copy()]
        this.best.alive = true

        // elitism
        for(let i = 0; i < Math.min(4, this.members.length); i++)
        {
            newPop.push(this.members[i].copy())
        }

        //species champions
        this.species.forEach(s => {
            if(s.members.length >= 5)
            { 
                newPop.push(s.members[0].copy())
            }
        })

        this.getNonCrossOvers((this.popSize/4) << 0, newNodeProb, newConnectionProb, weightPerturbProb, weightPerturbAmount)
            .forEach(m => newPop.push(m))

        // get crossovers
        this.getCrossOvers(this.popSize - newPop.length).forEach(m => newPop.push(m))

        this.members = newPop
        this.evalPop(iters, fitnessFunction, speciesThreshold)
    }

    getCrossOvers(n: number)
    {
        let speciesDistribution: number[] = []
        this.species.forEach((s, si) => {
            for(let i = 0; i < s.adjFitnessSum; i++)
            {
                speciesDistribution.push(si)
            }
        })

        let newMembers: Genome[] = []
        for(let i = 0; i < n; i++)
        {
            const si = speciesDistribution[Math.random()*speciesDistribution.length << 0]
            const s = this.species[si]
            newMembers.push(s.getNewGenome())
        }
        return newMembers
    }

    evalPop(iters, fitnessFunction, speciesThreshold) {
        this.calcFitnesses(iters, fitnessFunction)
        this.speciate(this.members, speciesThreshold)
        this.members.sort((a,b) => a.fitness < b.fitness ? 1 : -1)
        this.printStats()
    }

    nextGenerationNoSpecies(
        iters: number, 
        fitnessFunction: (g: Genome, i: number) => number, 
        newConnectionProb: number,
        newNodeProb: number,
        weightPerturbAmount: number,
        weightPerturbProb: number,
        survivalRate: number
        )
    {
        this.members = this.members.splice(0, this.members.length*survivalRate << 0)
        let newPop: Genome[] = [this.best.copy()]
        
        // elitism
        for(let i = 0; i < 4; i++)
        {
            newPop.push(this.members[i].copy())
        }

        this.getNonCrossOvers(this.popSize - newPop.length, newNodeProb, newConnectionProb, weightPerturbProb, weightPerturbAmount)
            .forEach(m => newPop.push(m))

        this.members = newPop
        this.evalPopNoSpecies(iters, fitnessFunction)
    }

    evalPopNoSpecies(iters, fitnessFunction)
    {
        this.calcFitnesses(iters, fitnessFunction)
        this.members.sort((a,b) => a.fitness < b.fitness ? 1 : -1)
        this.printStats()
    }

    printStats() 
    {
        console.log("-----------------------------------")
        console.log("Best fitness total:", this.best.fitness)
        console.log("Best fitness in current generation:", this.members[0].fitness)
        console.log("Mean fitness:", this.meanFitness)
        console.log("Num species:", this.species.length)
        console.log("-----------------------------------")
    }

    removeBadGenomes(survivalRate: number, stagnationThreshold: number, onReset: any)
    {
        this.species.forEach(s => {
            if (s.stagnationCount > stagnationThreshold) {
                s.markAllGenomes()
            } else {
                s.markBadGenomes(survivalRate)
            }
        })

        if(this.members.reduce((total, m) => total + Number(m.alive), 0) == 0)
        {
            onReset()
        }
        else
        {
            this.members = this.members.filter(m => m.alive)
            this.species = this.species.filter(s => s.stagnationCount <= stagnationThreshold)
        }
    }

    getNonCrossOvers(n : number, newNodeProb, newConnectionProb, weightPerterbProb, weightPerturbAmount){
        let nonCrossovers = []
        for(let i = 0; i < n; i++)
        {
            const x = Math.random()*this.members.length << 0
            nonCrossovers.push(this.members[x].copy())
        }
        this.addRandomNodes(nonCrossovers, newNodeProb)
        this.addRandomConnections(nonCrossovers, newConnectionProb)
        for(let g of nonCrossovers) {
            if(Math.random() < weightPerterbProb) {
                g.perturbWeights(weightPerturbAmount)
                g.perturbBias(weightPerturbAmount/4)
            }
        }
        return nonCrossovers
    }

    calcFitnesses(iters, fitnessFunction: (g: Genome, i: number) => number): void 
    {
        // parallelize
        for(let g of this.members)
        {
            g.fitness = fitnessFunction(g, iters)
        }

        this.meanFitness = this.members.reduce((acc, m) => acc+m.fitness, 0)/this.members.length

        //init best
        if (this.best === null) 
            this.best = this.members[0]

        // calc normal fitness
        const worst = this.members.reduce((acc ,g) => g.fitness < acc ? g.fitness : acc, 0)

        this.members.forEach(g => g.normalFitness = g.fitness-worst)
        // update best
        for(let g of this.members) 
        {
            if (g.fitness > this.best.fitness)
            {
                this.best = g.copy()
            }
        }
    }

    generateInitialPopulation(): Genome[] 
    {
        const pop: Genome[] = []
        const g = new Genome(this.nInp, this.nOut, this.ing)
        for(let i = 0; i < this.popSize; i++){
            pop.push(g.copy())
        }
        return pop
    }

    addRandomConnections(pop: Genome[], prob: number): void {
        let mutations = {}

        for(let g of pop) {
            if(Math.random() < prob) {
                const q = g.getConnectionCandidate()
                if(q == null)
                {
                    return
                }
                else
                {
                    const [a,b] = q
                    if(mutations[a] && mutations[a][b]){
                        g.addConnection(a,b,uniformRandom(), mutations[a][b])
                    } else {
                        const iNumber = this.ing.next
                        g.addConnection(a,b,uniformRandom(), iNumber)
                        if(!mutations[a]) {
                            mutations[a] = {}
                        }
                        mutations[a][b] = iNumber
                    }
                }
            }
        }
    }

    addRandomNodes(pop: Genome[], prob: number): void {
        let mutations = {}

        for(let g of pop) {
            if(Math.random() < prob) {
                const [a,b] = g.getNodeCandidate()
                if(mutations[a] && mutations[a][b]){
                    g.addNode(a,b,Sigmoid,mutations[a][b])
                } else {
                    const iNumber = this.ing.next
                    g.addNode(a,b,Sigmoid, iNumber)
                    if(!mutations[a]) {
                        mutations[a] = {}
                    }
                    mutations[a][b] = iNumber
                }
            }
        }
    }

    speciate(members: Genome[], threshold: number): void
    {
        this.species.forEach(s => s.reset())
        const speciateMember = (m: Genome): void => {
            for(const s of this.species){
                if(Genome.delta(m,s.representative, 1, 1) < threshold) {
                    s.addGenome(m)
                    return
                }
            }
            this.species.push(new Species(m))
        }

        members.forEach(m => speciateMember(m))
        this.species.forEach(s => s.nextGen(this.meanFitness))
        this.species = this.species.filter(s => s.members.length != 0)
    }

}