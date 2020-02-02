import { logit, argMax, Range, falloffMap, normalize, multinomial } from './../Utils'

export class Weight {
    readonly numPossibleValues: number
    readonly possibleWeightValues: number[]
    private banditValues: number[]
    private currentWeight: number
    private readonly falloffMaps: number[][]
    private lastIndexUsed

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
            maps.push(falloffMap(i, this.numPossibleValues, 0.4))
        }
        return maps
    }

    private setWeightToBestBandit() {
        this.lastIndexUsed = argMax(this.banditValues)
        this.currentWeight = this.possibleWeightValues[this.lastIndexUsed]
    }

    private setWeightExplore() {
        this.lastIndexUsed = multinomial(normalize(falloffMap(argMax(this.banditValues),this.numPossibleValues,0.2)))
        this.currentWeight = this.possibleWeightValues[this.lastIndexUsed]
    }

    updateBanditWeight(index: number, reward: number, alpha: number, scale: number): void
    {
        this.banditValues[index] += scale*alpha*(reward - this.banditValues[index])
    }

    update(reward: number, decay: number): void
    {
        const alpha = 1-decay
        const i = this.lastIndexUsed

        this.falloffMaps[i].forEach((falloff,index) => {
            this.updateBanditWeight(index, reward, alpha, falloff)
        })

        if (Math.random() < 0.1) {
            this.setWeightExplore()
        } else {
            this.setWeightToBestBandit()
        }
    }

    forward(v: number): number {
        return v*this.currentWeight
    }
    
}