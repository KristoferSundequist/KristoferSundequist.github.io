import * as tf from '@tensorflow/tfjs';

export class Model {
    private network: any
    private banditValues: any
    private weightBuckets: any
    private num_weight_buckets: number

    constructor(action_space_size: number, state_space_size: number, num_weight_buckets: number)
    {
        // init network
        this.network = this.networkFactory(action_space_size, state_space_size)
        
        // init bandit values
        this.banditValues = this.network.weights.map(w => tf.randomUniform([...w.shape, num_weight_buckets]))
        
        // init weightBuckets
        const logit = p => Math.log(p/(1-p))
        const weightValues = [...Array(num_weight_buckets).keys()].map(v => logit((v+1)/(num_weight_buckets+1)))
        this.weightBuckets = tf.tensor(weightValues)
        
        this.num_weight_buckets = num_weight_buckets
    }

    act_softmax(state: number[]): number
    {
        return tf.tidy(() =>
        {
            const logits = this.network.predict(tf.tensor([state]))
            const action = tf.multinomial(logits, 1, Math.random(), false).dataSync()[0]
            return action
        })
    }

    act_Q(state: number[]): number {
        return tf.tidy(() =>
        {
            const logits = this.network.predict(tf.tensor([state]))
            const action = logits.argMax(1).dataSync()[0]
            return action
        })
    }

    update(reward: number, decay: number) {
        for (let i = 0; i < this.network.weights.length; i++)
        {
            this.updateBanditValues(i, reward, decay)
            this.updateNetworkWeight(i)
        }
    }

    private updateBanditValues(index: number, reward: number, decay: number): void
    {
        const new_vals = tf.tidy(() => {
            const vals = this.banditValues[index]

            const indices = vals.argMax(-1)
            const map = tf.oneHot(indices.flatten(), this.num_weight_buckets).reshape(vals.shape).toFloat()
            const reverse_map = tf.oneHot(indices.flatten(), this.num_weight_buckets, 0, 1).reshape(vals.shape).toFloat()

            const decay_map = map.mul(decay)
            const decayed_vals = vals.mul(reverse_map).add(vals.mul(decay_map))
            
            //const reward_map = map.mul(reward)
            const reward_map = map.mul((1-decay)*reward)
            const new_vals = decayed_vals.add(reward_map)

            return new_vals
        })
        this.banditValues[index].dispose()
        this.banditValues[index] = new_vals
    }

    private updateNetworkWeight(index: number): void
    {
        tf.tidy(() => {
            const indices = this.banditValues[index].argMax(-1)
            const new_weights = this.weightBuckets.gather(indices).reshape(this.network.weights[index].shape)
            this.network.weights[index].write(new_weights)
        })
    }

    private networkFactory(num_actions: number, state_size: number)
    {
        return tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [state_size],
                    units: 32,
                    kernelInitializer: 'orthogonal',
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: num_actions,
                    kernelInitializer: 'orthogonal',
                    activation: 'linear'
                })
            ]
        })
    }
}
