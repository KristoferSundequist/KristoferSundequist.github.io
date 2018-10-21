export class InnovationNumberGenerator {
    private current
    
    constructor(start = 0) {
        this.current = start
    }

    get next() {
        return this.current++;
    }
}