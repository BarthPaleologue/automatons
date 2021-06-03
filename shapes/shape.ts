import { Vector2 } from "../vector2.js";

export class Shape {
    position: Vector2;
    theta: number;
    scale: number;
    color: string;
    context: CanvasRenderingContext2D;
    constructor(initialPosition: Vector2, theta: number, scale: number, ctx: CanvasRenderingContext2D) {
        this.position = initialPosition;
        this.theta = theta;
        this.scale = scale;
        this.color = "white";
        this.context = ctx;
    }
    draw() { }
    move(displacement: Vector2) {
        this.position.addInPlace(displacement);
    }
    getForwardVector() {
        return new Vector2(Math.cos(this.theta), Math.sin(this.theta));
    }
    moveForward(amount: number) {
        this.move(this.getForwardVector().scale(amount));
    }
    rotateRad(amount: number) {
        this.theta += amount;
    }
    setColor(color: string) {
        this.color = color;
    }
}