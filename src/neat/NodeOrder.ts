import {Node} from './Node'

export default class NodeOrder {
    ings: number[]
    nInps: number
    nOuts: number

    constructor(nInps: number, nOuts: number) {
        this.ings = []
        this.nInps = nInps
        this.nOuts = nOuts
    }

    copy(): NodeOrder
    {
        const no = new NodeOrder(this.nInps, this.nOuts)
        no.ings = this.ings.slice()
        return no
    }

    addNode(ing_a: number, ing_new: number)
    {
        const i = this.ings.reduce((acc,cur_node,i) => ing_a === cur_node ? i : acc, -1)
        if(i === -1)
        {
            this.ings.splice(0,0,ing_new)
        }
        else
        {
            this.ings.splice(i+1, 0, ing_new)
        }
    }

    push(ing: number) {
        this.ings.push(ing)
    }

    getConnectionCandidate(verbose = false) : [number, number]
    {

        // [0,1] + [43,12,55] + [2, 3]

        const num_fixed_nodes = this.nInps + this.nOuts
        const len = num_fixed_nodes + this.ings.length
        
        let index_in = (len-this.nOuts)*Math.random() << 0
        
        const lowerBound = Math.max(index_in+1, this.nInps)
        let index_out = ((len - lowerBound)*Math.random() << 0) + lowerBound

        if(verbose)
            console.log("before", index_in, index_out)

        if(index_in >= this.nInps)
        {
            index_in = this.ings[index_in-this.nInps]
        }

        if(index_out < (this.nInps + this.ings.length))
        {
            index_out = this.ings[index_out - this.nInps]
        }
        // index_out == output node
        else 
        {
            index_out -= this.ings.length
        }
        
        if(verbose)
            console.log("after", index_in, index_out)
        
        //console.log(index_in, index_out)
        return [index_in, index_out]
    }

    * stream()
    {
        for(let ing of this.ings){
            yield ing
        }
    }

}