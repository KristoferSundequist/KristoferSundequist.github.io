import * as tf from "@tensorflow/tfjs";

export function getActor(
  num_actions: number,
  state_size: number
): tf.Sequential {
  return tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [state_size],
        units: 128,
        kernelInitializer: "orthogonal",
        activation: "relu",
        useBias: true
      }),
      tf.layers.dense({
        units: 128,
        kernelInitializer: "orthogonal",
        activation: "relu",
        useBias: true
      }),
      tf.layers.dense({
        units: num_actions,
        kernelInitializer: "orthogonal",
        activation: "softmax"
      })
    ]
  });
}

export function getCritic(state_size: number): tf.Sequential {
  return tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [state_size],
        units: 128,
        kernelInitializer: "orthogonal",
        activation: "relu",
        useBias: true
      }),
      tf.layers.dense({
        units: 128,
        kernelInitializer: "orthogonal",
        activation: "relu",
        useBias: true
      }),
      tf.layers.dense({
        units: 1,
        kernelInitializer: "orthogonal",
        activation: "linear"
      })
    ]
  });
}
