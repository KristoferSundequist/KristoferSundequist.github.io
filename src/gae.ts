export async function GAE(rewards: number[], values: number[], gamma:number = 0.99, lambda:number = 0.95)
{
    values = values.slice()
    values.push(values[values.length-1])

    const gaes = []
    let gae = 0
    for(let i = rewards.length-1; i >= 0; i--)
    {
        const delta = rewards[i] + gamma*values[i+1] - values[i]
        gae = delta + gamma*lambda*gae
        gaes[i] = gae
    }
    return gaes
}