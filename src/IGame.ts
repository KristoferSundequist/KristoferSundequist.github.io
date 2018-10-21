export interface IGame {
    getState() : number[]
    step(action: number): number
}