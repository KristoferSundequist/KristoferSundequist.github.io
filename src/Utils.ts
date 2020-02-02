export const Sigmoid = v => 1/(1+Math.exp((-4.9)*v))
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

export function softmax(input: number[]): number[]
{
    const expsum = input.reduce((acc, v) => Math.exp(v) + acc, 0)
    return input.map(v => Math.exp(v)/expsum)
}

export function normalize(input: number[]): number[]
{
    const sum = input.reduce((acc, v) => v + acc, 0)
    return input.map(v => v/sum)
}

export const logit = (p: number): number => Math.log(p/(1-p))

export function argMax(arr: number[]): number
{
    let curIndex = 0
    let curValue = -Infinity
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > curValue) {
            curValue = arr[i]
            curIndex = i
        }
    }
    return curIndex
}

export function Range(n: number): number[]
{
    return [...Array(n).keys()]
}

export async function sleep(time: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function falloffMap(center: number, length: number, fallOff: number): number[]
{
    let falloffMap = Range(length).map(_ => 0)
    let falloff = 1
    falloffMap[center] = falloff
    for (let i = 1; i < length; i++)
    {
        falloff *= fallOff
        if (center+i < length) {
            falloffMap[center+i] = falloff
        }
        if (center-i >= 0) {
            falloffMap[center-i] = falloff
        }
    }
    return falloffMap
}

