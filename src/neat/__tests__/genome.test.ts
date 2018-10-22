import Genome from './../Genome'
import {InnovationNumberGenerator} from './../InnovationNumberGenerator'
import { Linear, Sigmoid } from '../Utils';

function networkFactory(nInp, nOut){
    const start = nInp+nOut
    const ing = new InnovationNumberGenerator(start)
    const g = new Genome(nInp,nOut, ing)
    return g
}
describe('basic', () => {
    test('no connections returns zeroes', () => {
        const g = networkFactory(2,2)
        const o = g.forward([5,5])
        expect(o).toEqual([0,0])
    })
})


describe('add connection', () => {
    test('simple', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        expect(g.forward([1,1])).toEqual([1,0])
    })
    
    test('multiple connections', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.addConnection(1,2,1)
        g.addConnection(1,3,5)
        expect(g.forward([1,2])).toEqual([3,10])
    })

    test('same outout', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        const o = g.forward([1,1])
        const o2 = g.forward([1,1])
        expect(o2).toEqual(o)
    })
})

describe('get action', () => {
    test('simple', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.addConnection(1,2,1)
        g.addConnection(1,3,5)
        expect(g.getAction([1,2])).toEqual(1)
    })

    test('simple get action2', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.addConnection(1,2,1)
        g.addConnection(1,3,5)
        expect(g.getAction([1,0])).toEqual(0)
    })
})

describe('disable connection', () => {
    test('simple', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.addConnection(1,2,10)
        g.connections[1][2].toggleDisabled()
        expect(g.forward([1,2])).toEqual([1,0])
    })
})

describe('add node', () => {
    test('simple check existance', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        expect(g.addNode(0,2,Linear)).not.toBe(null)
    })

    test('non existing connection', () => {
        const g = networkFactory(2,2)
        expect(g.addNode(0,2,Linear)).toBe(null)
    })

    test('not add to disabled connection', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.connections[0][2].toggleDisabled()
        expect(g.addNode(0,2,Linear)).toBe(null)
    })

    test('check disable connection', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,1)
        g.addNode(0,2,Linear)
        expect(g.connections[0][2].disabled).toBe(true)
    })

    test('check new connection values', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,77)
        g.addNode(0,2,Linear)
        expect(g.connections[0][5].weight).toBe(1)
        expect(g.connections[5][2].weight).toBe(77)
        expect(g.connections[0][2].disabled).toBe(true)
    })

    test('correct output', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        const o = g.forward([1,1])
        expect(o).toEqual([2,0])
    })

    test('same output', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        const o = g.forward([1,1])
        g.addNode(0,2,Linear)
        const o2 = g.forward([1,1])
        expect(o).toEqual(o2)
    })

    test('reccurent', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,7)
        const n = g.addNode(0,2,Linear)
        const n2 = g.addNode(n.innovationNumber,2, Linear)
        g.addConnection(n2.innovationNumber, n.innovationNumber, 1)
        const o = g.forward([2,1])
        const o2 = g.forward([2,1])
        const o3 = g.forward([2,1])
        expect(o).toEqual([14,0])
        expect(o2).toEqual([28,0])
        expect(o3).toEqual([42,0])
        
    })
    
})

describe('perturbWeights', () => {
    test('simple', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,7)
        g.perturbWeights(1)
        expect(g.connections[0][2].weight).not.toEqual(7)
    })

    test('multiple connections', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,7)
        const n = g.addNode(0,2,Linear)
        g.perturbWeights(1)
        expect(g.connections[0][n.innovationNumber].weight).not.toEqual(1)
        expect(g.connections[n.innovationNumber][2].weight).not.toEqual(7)
        expect(g.connections[0][2].weight).toEqual(7)
    })
})