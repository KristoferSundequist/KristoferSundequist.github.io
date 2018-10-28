export const Sigmoid = v => 1/(1+Math.exp(-v))
export const Linear = v => v

export function deepCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o))
}