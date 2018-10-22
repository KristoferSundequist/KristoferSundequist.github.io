import {Gene} from './Gene'

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
        this.weight += ((Math.random()*2)-1)*amount
    }
}