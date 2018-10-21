export class Point
{
    x: number;
    y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    static distance(a: Point, b: Point): number
    {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
    
        return Math.sqrt(dx*dx + dy*dy);
    }
}