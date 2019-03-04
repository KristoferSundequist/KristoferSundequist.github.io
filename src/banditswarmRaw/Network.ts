import { Layer } from './Layer'

export class Network {
    private layers: Layer[]

    constructor() {
        this.layers = []
    }

    update(reward: number, decay: number): void
    {
        for (let l of this.layers) {
            l.update(reward, decay)
        }
    }

    forward(input: number[]): number[]
    {
        let current = input
        for (let l of this.layers) {
            current = l.forward(current)
        }
        return current
    }

    addLayer(newLayer: Layer): void
    {
        // make sure layer nInputs/nOutputs match
        if (this.layers.length > 0 && newLayer.nInputs != this.layers[this.layers.length - 1].nOutputs) {
            throw Error("inputs of new layer doesnt add nOutputs of current last layer")
        }

        this.layers.push(newLayer)
    }
}