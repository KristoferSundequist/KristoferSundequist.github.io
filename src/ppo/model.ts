import * as tf from '@tensorflow/tfjs';

export function getActor(num_actions: number, state_size: number)
{
    return tf.sequential({
        layers: [
            tf.layers.dense({
                inputShape: [state_size],
                units: 200,
                kernelInitializer: 'glorotNormal',
                activation: 'elu'
            }),
            tf.layers.dense({
                units: 200,
                kernelInitializer: 'glorotNormal',
                activation: 'elu'
            }),
            tf.layers.dense({
                units: 200,
                kernelInitializer: 'glorotNormal',
                activation: 'elu'
            }),
            tf.layers.dense({
                units: num_actions,
                kernelInitializer: 'glorotNormal',
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
            kernelInitializer: 'glorotNormal',
            activation: 'elu'
        }),
        tf.layers.dense({
            units: 200,
            kernelInitializer: 'glorotNormal',
            activation: 'elu'
        }),
        tf.layers.dense({
            units: 200,
            kernelInitializer: 'glorotNormal',
            activation: 'elu'
        }),
        tf.layers.dense({
            units: 1,
            kernelInitializer: 'glorotNormal',
            activation: 'linear'
        })
    ]
    })
}