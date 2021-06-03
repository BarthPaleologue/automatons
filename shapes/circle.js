import { Shape } from "./shape.js";
export class Circle extends Shape {
    constructor(initialPosition, theta, scale, aperture, ctx) {
        super(initialPosition, theta, scale, ctx);
        this.aperture = aperture;
    }
    draw() {
        this.context.translate(this.position.x, this.position.y); //translate to center of shape
        this.context.rotate(this.theta); //rotate 25 degrees.
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(0, 0, this.scale, -this.aperture / 2, this.aperture / 2);
        this.context.lineTo(0, 0);
        this.context.closePath();
        this.context.fill();
        this.context.rotate(-this.theta); //rotate 25 degrees.
        this.context.translate(-this.position.x, -this.position.y); //translate to center of shape
    }
}