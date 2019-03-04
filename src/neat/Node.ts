import { Gene } from './Gene'
import {uniformRandom} from './../Utils'

export class Node extends Gene {
    bias: number = 0
    charge: number = 0
    activation: (n: number) => number

    constructor(innovationNumber: number, activation: (n: number) => number) {
        super(innovationNumber)
        this.activation = activation
    }

    output(): number {
        return this.activation(this.charge + this.bias)
    }

    reset(): void {
        this.charge = 0
    }

    copy(): Node
    {
        const n = new Node(this.innovationNumber, this.activation)
        n.bias = this.bias
        return n
    }

    perturbBias(amount: number): void {
        this.bias += uniformRandom()*amount
    }
}