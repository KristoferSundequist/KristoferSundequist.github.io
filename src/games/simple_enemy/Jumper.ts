import {Circle} from "./Circle";

export class Jumper
{
    Body: Circle;
    context: CanvasRenderingContext2D;
    readonly width: number;
    readonly height: number;
    readonly speed: number;

    constructor(body: Circle, speed: number, context: CanvasRenderingContext2D, width: number, height: number)
    {
        this.Body = body;
        this.speed = speed
        this.context = context;
        this.width = width;
        this.height = height;
    }

    step(action: number): void
    {
        // move
        switch(action)
        {
            case 0:
            {
                this.Body.coords.x -= this.speed
                break;
            }
            case 1:
            {
                this.Body.coords.y -= this.speed
                break;
            }
            case 2:
            {
                this.Body.coords.x += this.speed
                break;
            }
            case 3:
            {
                this.Body.coords.y += this.speed
                break;
            }
        }

        this.enforceBounderies();
    }

    enforceBounderies(): void
    {
        // Enforce x bounderies
        if (this.Body.coords.x + this.Body.radius > this.width)
        {
            this.Body.coords.x = this.width - this.Body.radius;
        }
        if(this.Body.coords.x - this.Body.radius < 0)
        {
            this.Body.coords.x = this.Body.radius;
        }

        //Enforce y bounderies
        if (this.Body.coords.y + this.Body.radius >= this.height)
        {
            this.Body.coords.y = this.height - this.Body.radius;
        }
        if(this.Body.coords.y - this.Body.radius < 0)
        {
            this.Body.coords.y = this.Body.radius;
        }
    }

    render(): void
    {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'black';
        this.context.fill();
    }
}