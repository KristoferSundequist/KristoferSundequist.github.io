import {Node} from './Node'
import {InnovationNumberGenerator} from './InnovationNumberGenerator'
import {Connection} from './Connection'
import {Sigmoid, Linear} from './Utils'

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

    constructor(nInputs: number, nOutputs: number, ing: InnovationNumberGenerator) {
        this.nInputs = nInputs
        this.nOutputs = nOutputs
        this.ing = ing

        this.init()
        //this.testData()
    }

    testData() {
        this.connections[0][21] = new Connection(1, 20)
        this.hiddenNodes[21] = new Node(21, Sigmoid)
        this.connections[21] = {23: new Connection(1, 22)}
        this.hiddenNodes[23] = new Node(23, Sigmoid)
        this.connections[23] = {8: new Connection(1, 24)}
        this.connections[23][21] = new Connection(1,25) //recurrent connection
        //this.connections[23][21].toggleDisabled()
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

        let curMax = input[0]
        let curMaxIndex = 0
        for(let i = 0; i < input.length; i++) {
            if(outs[i] > curMax) {
                curMax = outs[i]
                curMaxIndex = i
            }
        }
        return curMaxIndex
    }

    addConnection(a: number, b: number, weight: number){
        if (!this.connections[a]) {
            this.connections[a] = {}
        }
        if (!this.connections[a][b]) {
            this.connections[a][b] = new Connection(weight, this.ing.next)
        }
    }

    addNode(a: number, b: number, activation: (n: number) => number): Node | null {
        if(this.connections[a] && this.connections[a][b] && !this.connections[a][b].disabled){
            const oldConnection = this.connections[a][b]
            oldConnection.toggleDisabled()
            const iNumber = this.ing.next
            const n = new Node(iNumber, activation)
            this.hiddenNodes[iNumber] = n
            this.addConnection(a, iNumber, 1)
            this.addConnection(iNumber, b, oldConnection.weight)
            return n
        }
        return null
    }
}