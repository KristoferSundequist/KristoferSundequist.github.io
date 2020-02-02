import Chart from 'chart.js';
import {chartContext} from "./index"

export function chartRewards(rewards: number[]): void
{
    new Chart(chartContext, {
        type: 'line',
        data: {
            labels: [...Array(rewards.length).keys()] as any[],
            datasets: [{
                data: rewards
            }]
        }
    });
}