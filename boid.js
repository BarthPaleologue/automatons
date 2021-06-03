import { Vector2 } from "./vector2.js";
import { Triangle } from "./shapes/triangle.js";
import { Circle } from "./shapes/circle.js";
export class Boid {
    constructor(initialPosition, theta, scale, hitboxRadius, fov, ctx) {
        this.velocity = new Vector2(0, 0);
        this.isHitboxDisplayed = false;
        this.shape = new Triangle(initialPosition, theta, scale, ctx);
        this.hitbox = new Circle(initialPosition, theta, hitboxRadius, fov, ctx);
        this.hitbox.setColor("rgba(255, 255, 255, 0.05)");
        this.hitboxRadius = hitboxRadius;
        this.fov = fov;
    }
    getForwardDirection() {
        return this.shape.getForwardVector();
    }
    draw() {
        if (this.isHitboxDisplayed)
            this.hitbox.draw();
        this.shape.draw();
    }
    move() {
        this.shape.position.addInPlace(this.velocity);
        this.shape.theta = Math.atan2(this.velocity.y, this.velocity.x);
        this.hitbox.position = this.shape.position;
        this.hitbox.theta = this.shape.theta;
    }
}
