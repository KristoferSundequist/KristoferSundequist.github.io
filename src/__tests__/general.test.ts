import { argMax } from './../Utils';

describe('argMax', () => {
    test('return biggest', () => {
        const i = argMax([5,1,-2,5,1,10,54,2])
        expect(i).toEqual(6)
    })

    test('return biggest', () => {
        const i = argMax([100,1,-2,5,1,10,54,2])
        expect(i).toEqual(0)
    })
})