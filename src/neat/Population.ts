import Genome from './Genome'
import Species from './Species'
import {InnovationNumberGenerator} from './InnovationNumberGenerator'

export default class Population {
    members: Genome[]
    species: Species[]
    popSize: number
    nInp: number
    nOut: number

    constructor(popSize: number, nInp: number, nOut: number) {
        this.popSize = popSize
        this.nInp = nInp
        this.nOut = nOut
    }

    generatePopulation(): Genome[] {
        const pop: Genome[] = []
        const ing = new InnovationNumberGenerator(this.nInp+this.nOut)
        const g = new Genome(this.nInp, this.nOut, ing)
        for(let i = 0; i < this.popSize; i++){
            pop.push(g.copy())
        }
        return pop
    }

    speciate(members: Genome[], threshold: number): Species[] {
        const species: Species[] = []

        const speciateMember = (m: Genome): void => {
            for(const s of species){
                if(Genome.delta(m,s.representative, 1, 1) < threshold) {
                    s.members.push(m)
                    return
                }
            }
            species.push(new Species(m))
        }

        members.forEach(m => speciateMember(m))
        return species     
    }

}