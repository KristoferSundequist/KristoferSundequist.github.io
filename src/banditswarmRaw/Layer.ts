export interface Layer {
    readonly nInputs: number
    readonly nOutputs: number
    forward: (n: number[]) => number[]
    update(reward: number, decay: number): void
}