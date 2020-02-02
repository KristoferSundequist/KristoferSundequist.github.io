import {Jumper} from './Jumper';
import { Point } from './Point';
import { Circle } from './Circle';
import { Reward } from './Reward';

export class Game
{
    private jumper: Jumper;
    private reward: Reward;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private jumperSpeed: number
    public static state_space_size: number = 6
    public static action_space_size: number = 4

    constructor(context: CanvasRenderingContext2D, width: number, height: number)
    {
        this.jumperSpeed = 10
        this.context = context;
        this.width = width;
        this.height = height;
        this.jumper = new Jumper(new Circle(new Point(Math.random()*this.width, Math.random()*this.height), 30), this.jumperSpeed, 0.5, context, width, height);
        this.reward = new Reward(new Circle(new Point(Math.random()*this.width, Math.random()*this.height), 50), context);
    }

    step(action: number): number
    {
        this.jumper.step(action);
        const reward = 100/Point.distance(this.jumper.Body.coords, this.reward.Body.coords)
        if (Math.random() < 0.001) {
            this.reward.Body.coords.x = Math.random()*this.width;
            this.reward.Body.coords.y = Math.random()*this.height;
        }
        return reward**2;
    }

    getState(): number[]
    {
        return [
            this.jumper.Body.coords.x/this.width,
            this.jumper.Body.coords.y/this.height,
            this.jumper.dx/this.jumperSpeed,
            this.jumper.dy/this.jumperSpeed,
            this.reward.Body.coords.x/this.width,
            this.reward.Body.coords.y/this.height
        ]
    }

    render()
    {
        this.context.clearRect(0, 0, this.width, this.height);
        this.jumper.render()
        this.reward.render()
    }
}