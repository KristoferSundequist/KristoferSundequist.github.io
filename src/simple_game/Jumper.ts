import {Circle} from "./Circle";

export class Jumper
{
    Body: Circle;
    context: CanvasRenderingContext2D;
    readonly maxSpeed: number;
    readonly width: number;
    readonly height: number;
    readonly acc: number;
    dx: number
    dy: number

    constructor(body: Circle, maxSpeed: number, _acc: number, context: CanvasRenderingContext2D, width: number, height: number)
    {
        this.Body = body;
        this.maxSpeed = maxSpeed;
        this.context = context;
        this.width = width;
        this.height = height;
        this.acc = _acc
        this.dx = 0
        this.dy = 0
    }

    step(action: number): void
    {
        // move
        switch(action)
        {
            case 0:
            {
                if(this.dx > -this.maxSpeed)
                    this.dx -= this.acc
                break;
            }
            case 1:
            {
                if(this.dy > -this.maxSpeed)
                    this.dy -= this.acc
                break;
            }
            case 2:
            {
                if(this.dx < this.maxSpeed)
                    this.dx += this.acc
                break;
            }
            case 3:
            {
                if(this.dy < this.maxSpeed)
                    this.dy += this.acc
                break;
            }
        }
        this.Body.coords.y += this.dy
        this.Body.coords.x += this.dx
        this.dy *= 0.99
        this.dx *= 0.99

        this.enforceBounderies();
    }

    enforceBounderies(): void
    {
        // Enforce x bounderies
        if (this.Body.coords.x + this.Body.radius > this.width)
        {
            this.dx*=-1
            this.Body.coords.x = this.width - this.Body.radius;
        }
        if(this.Body.coords.x - this.Body.radius < 0)
        {
            this.dx*=-1
            this.Body.coords.x = this.Body.radius;
        }


        //Enforce y bounderies
        if (this.Body.coords.y + this.Body.radius >= this.height)
        {
            this.dy*=-1
            this.Body.coords.y = this.height - this.Body.radius;
        }
        if(this.Body.coords.y - this.Body.radius < 0)
        {
            this.dy*=-1
            this.Body.coords.y = this.Body.radius;
        }
    }

    render(): void
    {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'black';
        this.context.fill();
        //this.context.lineWidth = 5;
        //this.context.strokeStyle = '#003300';
        //this.context.stroke();
    }
}