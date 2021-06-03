import { Vector2 } from "../vector2.js";
export class Shape {
    constructor(initialPosition, theta, scale, ctx) {
        this.position = initialPosition;
        this.theta = theta;
        this.scale = scale;
        this.color = "white";
        this.context = ctx;
    }
    draw() { }
    move(displacement) {
        this.position.addInPlace(displacement);
    }
    getForwardVector() {
        return new Vector2(Math.cos(this.theta), Math.sin(this.theta));
    }
    moveForward(amount) {
        this.move(this.getForwardVector().scale(amount));
    }
    rotateRad(amount) {
        this.theta += amount;
    }
    setColor(color) {
        this.color = color;
    }
}
