import {Node} from './Node'
import {InnovationNumberGenerator} from './InnovationNumberGenerator'
import {Connection} from './Connection'
import {Sigmoid, Linear, randomKey, multinomial} from './Utils'
import { Gene } from './Gene';

function copy(o) {
    return JSON.parse(JSON.stringify(o))
}

export default class Genome {
    nInputs: number
    nOutputs: number
    inputNodes: {[n: number]: Node} = {}
    outputNodes: {[n: number]: Node} = {}
    hiddenNodes: {[n: number]: Node} = {}
    connections: {[n: number]: {[n: number]: Connection}} = {}
    ing: InnovationNumberGenerator
    numGenes: number = 0
    fitness: number = NaN
    adjustedFitness: number = 0
    normalFitness: number = 0
    alive: boolean

    constructor(nInputs: number, nOutputs: number, ing: InnovationNumberGenerator) {
        this.nInputs = nInputs
        this.nOutputs = nOutputs
        this.ing = ing
        this.alive = true
        this.init()
    }

    getConnectionCandidate(): [number, number] | null
    {
        const inp = {...this.hiddenNodes, ...this.inputNodes}
        const out = {...this.hiddenNodes, ...this.outputNodes}

        let inpk
        let outk
        for(let i = 0; i < 100; i++){
            inpk = randomKey(inp)
            outk = randomKey(out)
            if(!this.connections[inpk] || !this.connections[inpk][outk]){
                return [Number(randomKey(inp)), Number(randomKey(out))]
            }
        }
        return null
    }

    getNodeCandidate(): [number, number] {
        const inpk = randomKey(this.connections)
        const outk = randomKey(this.connections[inpk])
        return [Number(inpk), Number(outk)]
    }

    init() {
        const tempING = new InnovationNumberGenerator(0)
        // Create nodes
        for(let i = 0; i < this.nInputs; i++) {
            const IN = tempING.next
            const n = new Node(IN, Linear)
            this.inputNodes[IN] = n
        }
        for(let i = 0; i < this.nOutputs; i++) {
            const IN = tempING.next
            const n = new Node(IN, Linear)
            this.outputNodes[IN] = n
        }
    }

    forward(input: number[], verbose: boolean = false): number[] {
        let toVisit: Node[] = []
        let visited = {}

        //input layer
        for(const i in input) {
            this.inputNodes[i].charge += input[i]
            toVisit.push(this.inputNodes[i])
        }

        //breadth first propagation
        while(toVisit.length > 0) {
            let newVisit: Node[] = []
            for(const node of toVisit){
                if(verbose) 
                    console.log("VISITING", node.innovationNumber)
                const curConnections = this.connections[node.innovationNumber]
                for(const key in curConnections){
                    const c = curConnections[key]
                    if(verbose) console.log(key)
                    if(c.disabled)
                        continue
                    const x = node.output()*c.weight
                    if(this.hiddenNodes[key]){
                        const hNode = this.hiddenNodes[key]
                        hNode.charge += x
                        if(!(key in visited)){
                            visited[key] = true
                            newVisit.push(hNode)
                        }
                    }else{
                        this.outputNodes[key].charge += x
                    }
                }
                node.reset()
            }
            toVisit = newVisit
        }
        const final: number[] = []
        for(const key in this.outputNodes){
            const node = this.outputNodes[key]
            final.push(node.output())
            node.reset()

        }
        return final
    }

    getAction(input: number[]): number {
        const outs = this.forward(input)

        let curMax = outs[0]
        let curMaxIndex = 0
        for(let i = 0; i < outs.length; i++) {
            if(outs[i] > curMax) {
                curMax = outs[i]
                curMaxIndex = i
            }
        }
        return curMaxIndex
    }

    
    getSoftmax(input: number[]): number[] {
        const outs = this.forward(input)
        const sum = outs.reduce((acc, v) => Math.exp(v) + acc, 0)
        return outs.map(v => Math.exp(v)/sum)
    }
    
    getActionSoftmax(input: number[]): number {
        return multinomial(this.getSoftmax(input))
    }

    addConnection(a: number, b: number, weight: number, iNumber?: number){
        if (!this.connections[a]) {
            this.connections[a] = {}
        }
        if (!this.connections[a][b]) {
            if(!iNumber)
                iNumber = this.ing.next
            this.connections[a][b] = new Connection(weight, iNumber) 
            this.numGenes++
        }
    }

    addNode(a: number, b: number, activation: (n: number) => number, iNumber?: number): Node | null {
        if(this.connections[a] && this.connections[a][b] && !this.connections[a][b].disabled){
            const oldConnection = this.connections[a][b]
            oldConnection.toggleDisabled()
            if (!iNumber)
                iNumber = this.ing.next
            const n = new Node(iNumber, activation)
            this.hiddenNodes[iNumber] = n
            this.addConnection(a, iNumber, 1)
            this.addConnection(iNumber, b, oldConnection.weight)
            return n
        }
        return null
    }

    forEachConnection(f: (c: Connection) => any) {
        for(const key in this.connections){
            for(const key2 in this.connections[key]){
                f(this.connections[key][key2])
            }
        }
    }

    perturbWeights(amount: number): void {
        this.forEachConnection(c => {
            if(!c.disabled) {
                c.perturbWeight(amount)
            }
        })
    }

    copy(): Genome {
        const g = new Genome(this.nInputs, this.nOutputs, this.ing)
        g.numGenes = this.numGenes
        g.fitness = this.fitness
        g.adjustedFitness = this.adjustedFitness
        g.normalFitness = this.normalFitness
        g.alive = this.alive

        // Copy hidden nodes
        for(const key in this.hiddenNodes) {
            g.hiddenNodes[key] = new Node(this.hiddenNodes[key].innovationNumber, this.hiddenNodes[key].activation)
        }

        // copy connections
        for(const key in this.connections){
            if(!g.connections[key]){
                g.connections[key] = {}
            }
            for(const key2 in this.connections[key]){
                g.connections[key][key2] = new Connection(this.connections[key][key2].weight, this.connections[key][key2].innovationNumber)
                g.connections[key][key2].disabled = this.connections[key][key2].disabled
            }
        }

        return g
    }

    // assumes that a is more fit than b
    static crossOver(a: Genome, b: Genome, wInheritance: number = .5, disable: number = .75): Genome {
        const cross = a.copy()
        for(const key in a.connections){
            if(b.connections[key]){
                for(const key2 in a.connections[key]){
                    if(b.connections[key][key2]){
                        if(a.connections[key][key2].innovationNumber === b.connections[key][key2].innovationNumber){
                            // randomly take weight from parents
                            if(Math.random() < wInheritance) {
                                cross.connections[key][key2].weight = b.connections[key][key2].weight
                            }

                            //disable if either parent is disabled
                            if(Math.random() < disable) {
                                if(a.connections[key][key2].disabled || b.connections[key][key2].disabled) {
                                    cross.connections[key][key2].disabled = true
                                }
                            }
                        }
                    }
                }
            }
        }

        return cross
    }

    static delta(a: Genome, b: Genome, ct: number, cw: number): number 
    {
        let T = 0
        let W = 0
        let nW = 0

        for(const key in a.connections)
        {
            for(const key2 in a.connections[key])
            {
                if(!b.connections[key])
                {
                    T++
                    continue
                }
                if(!b.connections[key][key2] || (a.connections[key][key2].innovationNumber !== b.connections[key][key2].innovationNumber))
                {
                    T++
                    continue
                }
                W += Math.abs(a.connections[key][key2].weight - b.connections[key][key2].weight)
                nW++
            }
        }

        for(const key in b.connections)
        {
            for(const key2 in b.connections[key])
            {
                if(!a.connections[key])
                {
                    T++
                    continue
                }
                if(!a.connections[key][key2] || (a.connections[key][key2].innovationNumber !== b.connections[key][key2].innovationNumber))
                {
                    T++
                    continue
                }
            }
        }
 
        const wr = (nW === 0) ? 0 : cw*(W/nW)
        const maxGenes = Math.max(a.numGenes, b.numGenes)
        const N = maxGenes < 20 ? 1 : maxGenes
        const cr = (maxGenes === 0) ? 0 : ct*(T/N)
        return cr + wr
    }
}