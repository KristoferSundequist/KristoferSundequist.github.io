import {chartRewards} from "./chartDrawer"

export class Logger {
    reward_log: number[]
    running_avg_reward: number
    decay: number

    constructor (decay: number) {
        this.reward_log = []
        this.running_avg_reward = 0
        this.decay = decay
    }

    push(reward: number): void
    {
        this.reward_log.push(reward)
        this.running_avg_reward = this.running_avg_reward === 0 ? reward : this.decay*this.running_avg_reward + (1-this.decay)*reward
    }

    getRunningAvg(): number
    {
        return this.running_avg_reward
    }

    getLatest(): number
    {
        if (this.reward_log == []) {
            return NaN
        }
        return this.reward_log[this.reward_log.length - 1]
    }

    chartReward(): void
    {
        chartRewards(this.reward_log)
    }
}