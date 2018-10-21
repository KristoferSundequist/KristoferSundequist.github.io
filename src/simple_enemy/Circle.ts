import {Point} from "./Point";

export class Circle
{
    coords: Point;
    radius: number;

    constructor(coords: Point, radius: number)
    {
        this.coords = coords;
        this.radius = radius;
    }

    static Intersect(a: Circle, b: Circle): boolean
    {
        return Point.distance(a.coords, b.coords) < a.radius + b.radius;
    }
}