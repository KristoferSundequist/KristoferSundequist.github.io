export function GAE(rewards: number[], values: number[], gamma:number = 0.99, lambda:number = 0.95)
{
    values = values.slice()
    values.push(values[values.length-1])

    const gaes = []
    let gae = values[values.length-1]
    for(let i = rewards.length-1; i >= 0; i--)
    {
        const delta = rewards[i] + gamma*values[i+1] - values[i]
        gae = delta + gamma*lambda*gae
        gaes[i] = gae
    }
    return gaes
}

export function Discount(rewards: number[], gamma:number = 0.99, init)
{
    const returns = []
    let R = init
    for(let i = rewards.length-1; i >= 0; i--)
    {
        R = rewards[i] + gamma*R
        returns[i] = R
    }
    return returns
}