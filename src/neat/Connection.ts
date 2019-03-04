import {Gene} from './Gene'
import {uniformRandom} from './../Utils'

export class Connection extends Gene {
    weight: number
    disabled: boolean = false

    constructor(initWeight: number, innovationNumber: number) {
        super(innovationNumber)
        this.weight = initWeight
    }

    toggleDisabled() {
        this.disabled = !this.disabled
    }

    perturbWeight(amount: number): void {
        this.weight += uniformRandom()*amount
    }

    resetWeight(): void {
        this.weight = uniformRandom()
    }
}