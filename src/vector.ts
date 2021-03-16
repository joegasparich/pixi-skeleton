import { ObservablePoint, Point } from "pixi.js";
import { lerp } from "./helpers/math";

export default class Vector {
    public x: number;
    public y: number;

    public constructor(x = 0, y?: number) {
        this.x = x;
        this.y = y ?? x;
    }

    public inverse(): Vector {
        return new Vector(-this.x, -this.y);
    }

    public add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    public subtract(vector: Vector): Vector {
        return this.add(vector.inverse());
    }
    public multiply(amount: number): Vector {
        return new Vector(this.x * amount, this.y * amount);
    }
    public divide(amount: number): Vector{
        if (amount === 0) {
            try {
                throw "Can't divide by zero";
            } catch(e) {
                console.error(e);
                return this;
            }
        }
        return this.multiply(1 / amount);
    }
    public magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    public truncate(amount: number): Vector {
        return this.normalize().multiply(amount);
    }
    public normalize(): Vector {
        if (this.magnitude() === 0) return this;
        return this.divide(this.magnitude());
    }
    public round(): Vector {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }
    public floor(): Vector {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
    public ceil(): Vector {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }

    public equals(vector: Vector): boolean {
        return this.x == vector.x && this.y == vector.y;
    }

    public toString(): string {
        return `[${this.x}, ${this.y}]`;
    }

    public toPoint(): Point {
        return new Point(this.x, this.y);
    }

    public toObservablePoint(callback?: (this: any) => any, scope?: any): ObservablePoint {
        return new ObservablePoint(callback, scope, this.x, this.y);
    }

    public static Distance(vectorA: Vector, vectorB: Vector): number {
        return vectorA.subtract(vectorB).magnitude();
    }
    public static Dot(vectorA: Vector, vectorB: Vector): number {
        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    }

    public static Lerp(startPos: Vector, endPos: Vector, amount: number): Vector {
        return new Vector(
            lerp(startPos.x, endPos.x, amount),
            lerp(startPos.y, endPos.y, amount),
        );
    }

    public static FromPoint(point: Point): Vector {
        return new Vector(point.x, point.y);
    }

    public static Zero(): Vector {
        return new Vector(0, 0);
    }

    public static Serialize(vector: Vector): number[] {
        return [vector.x, vector.y];
    }
    public static Deserialize([x, y]: number[]): Vector {
        return new Vector(x, y);
    }
}
