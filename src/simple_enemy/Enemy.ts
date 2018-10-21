import {Point} from "./Point";
import {Circle} from "./Circle";

export class Enemy
{
    Body: Circle;
    speed: number;
    readonly target: Point;
    context: CanvasRenderingContext2D;

    constructor(body: Circle, speed:number, target: Point, context: CanvasRenderingContext2D)
    {
        this.Body = body;
        this.speed = speed;
        this.target = target;
        this.context = context;
    }
    
    step()
    {
        if (this.Body.coords.x < this.target.x) 
        {
            this.Body.coords.x += this.speed;
        }
        if (this.Body.coords.x > this.target.x) 
        {
            this.Body.coords.x -= this.speed;
        }

        if (this.Body.coords.y < this.target.y) 
        {
            this.Body.coords.y += this.speed;
        }
        if (this.Body.coords.y > this.target.y) 
        {
            this.Body.coords.y -= this.speed;
        }
    }

    render()
    {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'red';
        this.context.fill();
        //this.context.lineWidth = 0;
        //this.context.strokeStyle = '#003300';
        //this.context.stroke();
    }
}