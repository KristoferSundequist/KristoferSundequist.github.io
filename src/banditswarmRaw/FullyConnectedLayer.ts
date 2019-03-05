import { Weight } from './Weight'
import { Range } from './../Utils'
import { Layer } from './Layer'

export class FullyConnectedLayer implements Layer {
    readonly nInputs: number
    readonly nOutputs: number
    readonly activation: (n: number) => number
    private weights: Weight[][]
    private biases: Weight[]

    constructor(nInputs: number, nOutputs: number, numPossibleWeights: number, activation: (n: number) => number) {
        this.nInputs = nInputs
        this.nOutputs = nOutputs
        this.activation = activation

        this.weights = this.initWeights(nInputs, nOutputs, numPossibleWeights)
        this.biases = this.initBiases(nOutputs, numPossibleWeights)
    }

    initWeights(nInputs: number, nOutputs: number, numPossibleWeights: number): Weight[][] {
        return Range(nInputs).map(_ => 
            Range(nOutputs).map(_ =>
                new Weight(numPossibleWeights)
            )
        )
    }

    initBiases(nOutputs: number, numPossibleWeights: number): Weight[] {
        return Range(nOutputs).map(_ => new Weight(numPossibleWeights))
    }

    update(reward: number, decay: number): void
    {
        // update weights
        for (let wi of this.weights) {
            for (let wij of wi) {
                wij.update(reward, decay)
            }
        }

        // update biases
        this.biases.forEach(w => w.update(reward, decay))
    }

    forward(input: number[]): number[]
    {
        let output = Range(this.nOutputs).map(_ => 0)

        // do weight calc
        for (let i = 0; i < this.nInputs; i++) {
            for (let j = 0; j < this.nOutputs; j++) {
                output[j] += this.weights[i][j].forward(input[i])
            }
        }
        
        // apply bias
        for (let i = 0; i < this.nOutputs; i++) {
            output[i] += this.biases[i].forward(1)
        }

        return output.map(this.activation)
    }
}