import Genome from './Genome'

export default class Species {
    members: Genome[]
    representative: Genome

    constructor(g: Genome) {
        this.members = [g]
        this.representative = g
    }

    getFitness(i: number) {
        return this.members[i].fitness/this.members.length
    }
}