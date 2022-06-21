import { Shape } from "./shape";
import { Vector2 } from "../utils/vector2";

export class Triangle extends Shape {
    constructor(initialPosition: Vector2, theta: number, scale: number, ctx: CanvasRenderingContext2D) {
        super(initialPosition, theta, scale, ctx);
    }
    draw() {
        this.context.translate(this.position.x, this.position.y); //translate to center of shape
        this.context.rotate(this.theta); //rotate 25 degrees.

        this.context.fillStyle = this.color;

        this.context.moveTo(-this.scale / 2, -this.scale / 2);
        this.context.lineTo(-this.scale / 2, this.scale / 2); // base
        this.context.lineTo(this.scale, 0); // côté haut droit
        this.context.lineTo(-this.scale / 2, -this.scale / 2); // côté haut gauche

        this.context.rotate(-this.theta); //rotate 25 degrees.
        this.context.translate(-this.position.x, -this.position.y); //translate to center of shape
    }
}
