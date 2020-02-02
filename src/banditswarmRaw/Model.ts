import { Network } from './Network';
import { FullyConnectedLayer } from './FullyConnectedLayer';
import {softmax, multinomial, argMax} from './../Utils'

export class Model {
    network: Network

    constructor (nInputs: number, nOutputs: number, weightBuckets: number) {
        this.network = new Network()
        this.network.addLayer(new FullyConnectedLayer(nInputs, 32, weightBuckets, Math.tanh))
        this.network.addLayer(new FullyConnectedLayer(32, 32, weightBuckets, Math.tanh))
        this.network.addLayer(new FullyConnectedLayer(32, nOutputs, weightBuckets, n => n))
    }

    forward(n: number[]): number[]
    {
        return this.network.forward(n)
    }

    act_softmax(n: number[]): number
    {
        return multinomial(softmax(this.forward(n)))
    }
    
    act_Q(n: number[]): number
    {
        return argMax(this.forward(n))
    }

    update(reward: number, decay: number): void
    {
        this.network.update(reward, decay)
    }
}