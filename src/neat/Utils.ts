export const Sigmoid = v => 1/(1+Math.exp(-v))
export const Linear = v => v

export function deepCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o))
}

export function uniformRandom(): number {
    return (Math.random()*2)-1
}

export function randomKey(obj) {
    const keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0] 
}

export function multinomial(probs: number[]): number 
{
    const v = Math.random()
    let acc = 0

    for(let i = 0; i < probs.length; i++)
    {
        acc += probs[i]
        if(acc >= v)
        {
            return i
        }
    }
    return probs.length-1
}