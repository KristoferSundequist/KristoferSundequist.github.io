import { logit, argMax, Range, falloffMap } from './../Utils'

export class Weight {
    readonly numPossibleValues: number
    readonly possibleWeightValues: number[]
    private banditValues: number[]
    private currentWeight: number
    private readonly falloffMaps: number[][]

    constructor(numPossibleValues: number) {
        // init possibleValues
        this.possibleWeightValues =
            Range(numPossibleValues)
            .map(v => logit((v+1)/(numPossibleValues+1)))

        // init numPossibleValues
        this.numPossibleValues = numPossibleValues

        // init banditValues
        this.banditValues = 
            Range(numPossibleValues)
            .map(_ => Math.random())
            //.map(_ => Math.random()*2 - 1)
        
        this.setWeightToBestBandit()
        this.falloffMaps = this.getFalloffMaps()
    }

    private getFalloffMaps(): number[][]
    {
        let maps: number[][] = []
        for (let i = 0; i < this.numPossibleValues; i++) {
            maps.push(falloffMap(i, this.numPossibleValues, 0.6))
        }
        return maps
    }

    private setWeightToBestBandit() {
        this.currentWeight = this.possibleWeightValues[argMax(this.banditValues)]
    }

    updateBanditWeight(index: number, reward: number, alpha: number, scale: number): void
    {
        this.banditValues[index] += scale*alpha*(reward - this.banditValues[index])
    }

    update(reward: number, decay: number): void
    {
        const alpha = 1-decay
        const i = argMax(this.banditValues) // OBS: assumes last weight used is highest value (i.e greedy policy)

        this.falloffMaps[i].forEach(falloff => {
            this.updateBanditWeight(i, reward, alpha, falloff)
        })

        this.setWeightToBestBandit()
    }

    forward(v: number): number {
        return v*this.currentWeight
    }
    
}