import { Shape } from "./shape";
import { Vector2 } from "../utils/vector2";

export class Circle extends Shape {
    aperture: number;
    constructor(initialPosition: Vector2, theta: number, scale: number, aperture: number, ctx: CanvasRenderingContext2D) {
        super(initialPosition, theta, scale, ctx);
        this.aperture = aperture;
    }
    draw() {
        this.context.translate(this.position.x, this.position.y); //translate to center of shape
        this.context.rotate(this.theta); //rotate 25 degrees.

        this.context.moveTo(0, 0);
        this.context.arc(0, 0, this.scale, -this.aperture / 2, this.aperture / 2);
        this.context.lineTo(0, 0);

        this.context.rotate(-this.theta); //rotate 25 degrees.
        this.context.translate(-this.position.x, -this.position.y); //translate to center of shape
    }
}
