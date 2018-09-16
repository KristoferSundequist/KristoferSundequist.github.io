import * as tf from '@tensorflow/tfjs';

export function getActor(num_actions: number, state_size: number)
{
    return tf.sequential({
        layers: [
            tf.layers.dense({
                inputShape: [state_size],
                units: 200,
                kernelInitializer: 'varianceScaling',
                activation: 'relu'
            }),
            tf.layers.dense({
                units: 200,
                kernelInitializer: 'varianceScaling',
                activation: 'relu'
            }),
            tf.layers.dense({
                units: num_actions,
                kernelInitializer: 'varianceScaling',
                activation: 'linear'
            }),
            tf.layers.softmax({
                units: num_actions
            })
        ]
    })
}

export function getCritic(state_size: number)
{
    return tf.sequential({
    layers: [
        tf.layers.dense({
            inputShape: [state_size],
            units: 200,
            kernelInitializer: 'varianceScaling',
            activation: 'relu'
        }),
        tf.layers.dense({
            units: 200,
            kernelInitializer: 'varianceScaling',
            activation: 'relu'
        }),
        tf.layers.dense({
            units: 1,
            kernelInitializer: 'varianceScaling',
            activation: 'linear'
        })
    ]
    })
}