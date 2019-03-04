import Genome from './../Genome'
import {InnovationNumberGenerator} from './../InnovationNumberGenerator'
import { Linear, Sigmoid, deepCopy } from '../../Utils';

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

    test('getConnectionCandidate 1', () => {
        for(let i = 0; i < 100; i++)
        {
            const g = networkFactory(2,2)
            const [a,b] = g.getConnectionCandidate()
            expect(a).toBeLessThan(2)
            expect(b).toBeGreaterThan(1)
            expect(b).toBeLessThan(4)
            expect(b).toBeGreaterThan(a)
        }
    })

    test('getConnectionCandidate 2', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        g.addConnection(1,3,2)
        g.addNode(1,3,Linear)
        g.connections[5][2].toggleDisabled()
        g.connections[0][5].toggleDisabled()
        for(let i = 0; i < 100; i++)
            {
            const [a,b] = g.getConnectionCandidate()
            expect(a).not.toEqual(2)
            expect(a).not.toEqual(3)
            expect(b).not.toEqual(0)
            expect(b).not.toEqual(1)
        }
    })

    test('getConnectionCand 3', () => {
        const g = networkFactory(6,4)
        for(let i = 0; i < 100; i++)
        {
            const [a,b] = g.getConnectionCandidate()
            expect(a).toBeLessThan(6)
            expect(b).toBeGreaterThan(5)
        }        
    })

    test('simple node order', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        expect(g.nodeOrder.ings).toEqual([5])
    })

    test('more node order', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        expect(g.nodeOrder.ings).toEqual([8,5])
    })

    test('more node order 2', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        expect(g.nodeOrder.ings).toEqual([8,11,5])
    })

    test('more node order 3', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        expect(g.nodeOrder.ings).toEqual([8,11,5,14])
    })

    test('more node order 5', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        g.addConnection(1,3,1)
        g.addNode(1,3,Linear)
        expect(g.nodeOrder.ings).toEqual([18,8,11,5,14])
    })

    test('new forward', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        g.addConnection(1,3,2)
        g.addNode(1,3,Linear)
        const o = g.forward([1,1])
        expect(o).toEqual([2,2])
    })

    test('new forward 2', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        g.addConnection(1,3,2)
        g.addNode(1,3,Linear)
        g.connections[5][2].toggleDisabled()
        g.connections[0][5].toggleDisabled()
        const o = g.forward([1,1], false)
        expect(o).toEqual([8,2])
    })

    test('optional', () => {
        const g = networkFactory(2,2)
        const abc = g.testOptional()
        expect(abc).toEqual(3)
        const abc2 = g.testOptional(88)
        expect(abc2).toEqual(88)
    })

    /*
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
    */
    
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

describe('innovationNumber', () => {
    test('diff innnovationnumber copy', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g2.addConnection(0,3,2)
        expect(g1.connections[0][2].innovationNumber).toEqual(4)
        expect(g2.connections[0][2].innovationNumber).toEqual(4)
        expect(g2.connections[0][3].innovationNumber).toEqual(5)
    })

    test('diff innnovationnumber copy', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        const g2 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        g1.addConnection(1,3,10)
        g2.addConnection(0,2,2)
        expect(g1.connections[0][2].innovationNumber).toEqual(4)
        expect(g2.connections[0][2].innovationNumber).toEqual(6)
    })
})

describe('crossOver', () => {
    test('copy test', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        expect(g1.connections[0][2].weight).toEqual(g2.connections[0][2].weight)
        g2.perturbWeights(2)
        expect(g1.connections[0][2].weight).not.toEqual(g2.connections[0][2].weight)
    })

    test('simple crossover', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g2.perturbWeights(2)
        g2.addConnection(1,3,2)
        const cross = Genome.crossOver(g2,g1)
        expect(cross.connections[1][3].weight).toEqual(g2.connections[1][3].weight)
        expect(cross.connections[0][2].weight === g2.connections[0][2].weight || 
            cross.connections[0][2].weight === g1.connections[0][2].weight)
            .toBeTruthy()
    })

    test('simple crossover 2', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g2.perturbWeights(2)
        g2.addConnection(1,3,2)
        const cross = Genome.crossOver(g2,g1)
        expect(cross.connections[1][3].weight).toEqual(g2.connections[1][3].weight)
        expect(cross.connections[0][2].weight === g2.connections[0][2].weight || 
            cross.connections[0][2].weight === g1.connections[0][2].weight)
            .toBeTruthy()
    })

    test('fitness crossover', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const i = g1.addNode(0,2,Sigmoid)
        const g2 = g1.copy()
        g2.addConnection(1,3,2)
        const cross = Genome.crossOver(g1,g2)
        expect(cross.connections[1]).toBeUndefined()
        expect(cross.connections[i.innovationNumber][2].weight).toEqual(g1.connections[i.innovationNumber][2].weight)
    })
})

describe('delta', () => {

    test('same delta when copy', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        expect(Genome.delta(g1,g2, 1 ,1)).toEqual(0)
    })

    test('simple delta', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g2.addConnection(0,3,1)
        expect(Genome.delta(g1,g2, 1 ,1)).toEqual(1)
    })

    test('simple delta 2', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g1.addConnection(0,3,5)
        g2.addNode(0,2,Sigmoid)
        g2.connections[0][2].weight = 5
        expect(Genome.delta(g1,g2, 1 ,1)).toEqual(3 + 3)
    })

    test('diff innovation number same connection', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        const g2 = g1.copy()
        g1.addConnection(0,2,2)
        g2.addConnection(0,2,2)
        expect(Genome.delta(g1,g2, 1 ,1)).toEqual(2)
    })
})

describe('numGenes', () => {
    test('simple', () => {
        const nInp = 2
        const nOut = 2
        const start = nInp+nOut
        const ing = new InnovationNumberGenerator(start)
        const g1 = new Genome(nInp,nOut, ing)
        g1.addConnection(0,2,2)
        const g2 = g1.copy()
        g1.addConnection(0,3,5)
        g2.addNode(0,2,Sigmoid)
        g2.connections[0][2].weight = 5
        expect(g1.numGenes).toEqual(2)
        expect(g2.numGenes).toEqual(3)
    })
})

describe('copy', () => {
    test('copy1', () => {
        const g = networkFactory(2,2)
        g.addConnection(0,2,2)
        g.addNode(0,2,Linear)
        g.addNode(0,5,Linear)
        g.addNode(8,5,Linear)
        g.addNode(5,2,Linear)
        g.addConnection(1,3,2)
        g.addNode(1,3,Linear)
        g.connections[5][2].toggleDisabled()
        
        const g2 = g.copy()
        const o = g.forward([1,1])
        const o2 = g2.forward([1,1])
        expect(o).toEqual(o2)
    })
})