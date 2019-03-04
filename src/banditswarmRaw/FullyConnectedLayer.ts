import { Weight } from './Weight'
import { Range } from './../Utils'
import { Layer } from './Layer'

export class FullyConnectedLayer implements Layer {
    readonly nInputs: number
    readonly nOutputs: number
    readonly activation: (n: number) => number
    private weights: Weight[][]

    constructor(nInputs: number, nOutputs: number, numPossibleWeights: number, activation: (n: number) => number) {
        this.nInputs = nInputs
        this.nOutputs = nOutputs
        this.activation = activation

        this.weights = this.initWeights(nInputs, nOutputs, numPossibleWeights)
    }

    initWeights(nInputs: number, nOutputs: number, numPossibleWeights: number): Weight[][] {
        const initWeights: Weight[][] = []
        for(let i = 0; i < nInputs; i++) {
            const wi = Range(nOutputs).map(_ => new Weight(numPossibleWeights))
            initWeights.push(wi)
        }
        return initWeights
    }

    update(reward: number, decay: number): void
    {
        for (let wi of this.weights) {
            for (let wij of wi) {
                wij.update(reward, decay)
            }
        }
    }

    forward(input: number[]): number[]
    {
        let output = Range(this.nOutputs).map(_ => 0)
        for (let i = 0; i < this.nInputs; i++) {
            for (let j = 0; j < this.nOutputs; j++) {
                output[j] += this.weights[i][j].forward(input[i])
            }
        }
        return output.map(this.activation)
    }
}