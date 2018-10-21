import {Gene} from './Gene'

export class Connection extends Gene {
    weight: number
    disabled: boolean = false

    constructor(initWeight: number, innovationNumber: number) {
        super(innovationNumber)
        this.weight = initWeight
    }

    toggleDisabled() {
        this.disabled = !this.disabled
    }
}