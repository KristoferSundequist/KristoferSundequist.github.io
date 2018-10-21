import {Point} from "./Point";
import {Circle} from "./Circle";

export class Reward
{
    Body: Circle;
    context: CanvasRenderingContext2D;

    constructor(body: Circle, context: CanvasRenderingContext2D)
    {
        this.Body = body;
        this.context = context;
    }
    
    step()
    {
    }

    render()
    {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'green';
        this.context.fill();
    }
}