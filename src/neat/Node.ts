import { Gene } from './Gene'

export class Node extends Gene {
    charge: number = 0
    activation: (n: number) => number

    constructor(innovationNumber: number, activation: (n: number) => number) {
        super(innovationNumber)
        this.activation = activation
    }

    output(): number {
        return this.activation(this.charge)
    }

    reset(): void {
        this.charge = 0
    }
}