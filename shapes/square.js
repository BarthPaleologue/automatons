import { Shape } from "./shape.js";
export class Square extends Shape {
    constructor(initialPosition, theta, scale, ctx) {
        super(initialPosition, theta, scale, ctx);
    }
    draw() {
        this.context.translate(this.position.x, this.position.y); //translate to center of shape
        this.context.rotate(this.theta); //rotate 25 degrees.
        this.context.fillStyle = this.color;
        this.context.fillRect(-this.scale / 2, -this.scale / 2, this.scale, this.scale);
        this.context.rotate(-this.theta); //rotate 25 degrees.
        this.context.translate(-this.position.x, -this.position.y); //translate to center of shape
    }
}
