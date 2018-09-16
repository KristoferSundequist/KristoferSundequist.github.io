import {Jumper} from './Jumper';
import { Point } from './Point';
import { Circle } from './Circle';
import { Enemy } from './Enemy';

export class Game
{
    private jumper: Jumper;
    private enemy: Enemy;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(context: CanvasRenderingContext2D, width: number, height: number)
    {
        this.context = context;
        this.width = width;
        this.height = height;
        this.jumper = new Jumper(new Circle(new Point(100, 100), 30), 10, context, width, height);
        this.enemy = new Enemy(new Circle(new Point(600,600), 50), 5, this.jumper.Body.coords, context);
    }

    step(action: number): number
    {
        this.jumper.step(action);
        this.enemy.step();
        let reward = 0;
        if(Circle.Intersect(this.jumper.Body, this.enemy.Body))
        {
            this.enemy.Body.coords.x = Math.random()*this.width;
            this.enemy.Body.coords.y = Math.random()*this.height;
            reward--;
        }
        return reward;
    }

    getState(): Array<number>
    {
        return [this.jumper.Body.coords.x/this.width, this.jumper.Body.coords.y/this.height, this.enemy.Body.coords.x/this.width, this.enemy.Body.coords.y/this.height]
    }

    render()
    {
        this.context.clearRect(0, 0, this.width, this.height);
        this.jumper.render()
        this.enemy.render()
    }
}