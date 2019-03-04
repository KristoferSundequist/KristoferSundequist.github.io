import Genome from './Genome'

export default class Species {
    members: Genome[]
    representative: Genome
    maxFitness: number
    stagnationCount: number
    adjFitnessSum: number

    constructor(g: Genome) {
        this.members = [g]
        this.representative = g
        this.stagnationCount = 0
        this.maxFitness = g.normalFitness
        this.adjFitnessSum = 0
    }

    addGenome(g: Genome)
    {
        this.members.push(g)
        if(g.normalFitness > this.maxFitness) 
        {
            this.maxFitness = g.normalFitness
            this.stagnationCount = 0
        }
    }

    reset() 
    {
        // take best one instead ?
        this.representative = this.members[(Math.random()*this.members.length << 0)]
        this.members = []
    }

    calcAdjustedFitnesses()
    {
        this.members.forEach(m => m.adjustedFitness = m.normalFitness/this.members.length)
        this.adjFitnessSum = this.members.reduce((total, m) => m.adjustedFitness + total, 0) + 1e-05
    }

    sortByAdjFitness()
    {
        this.members.sort((a,b) => a.adjustedFitness < b.adjustedFitness ? 1 : -1)
    }

    getNewGenome(): Genome
    {
        const a = this.members[Math.random()*this.members.length << 0]
        const b = this.members[Math.random()*this.members.length << 0]
        return Genome.crossOver(a,b)
    }

    // assumes that this.members is sorted by adjfitness
    markBadGenomes(survivalRate: number): void
    {   
        if(this.members.length == 1) return
        for(let i = Math.ceil(this.members.length*survivalRate); i < this.members.length; i++)
        {
            this.members[i].alive = false
        }
    }

    markAllGenomes(): void 
    {
        this.members.forEach(m => m.alive = false)
    }

    nextGen(meanTotalFitness: number)
    {
        this.calcAdjustedFitnesses()
        this.sortByAdjFitness()
        this.stagnationCount++
    }
}