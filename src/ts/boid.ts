import { Shape } from "./shapes/shape";
import { Vector2 } from "./utils/vector2";
import { Triangle } from "./shapes/triangle";
import { Circle } from "./shapes/circle";

export class Boid {
    shape: Shape;
    hitbox: Circle;
    hitboxRadius: number;
    fov: number;
    velocity = new Vector2(Math.random() - 0.5, Math.random() - 0.5).scale(100);
    isHitboxDisplayed = false;
    constructor(initialPosition: Vector2, theta: number, scale: number, hitboxRadius: number, fov: number, ctx: CanvasRenderingContext2D) {
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
        if (this.isHitboxDisplayed) this.hitbox.draw();
        this.shape.draw();
    }
    move() {
        this.shape.position.addInPlace(this.velocity);
        this.shape.theta = Math.atan2(this.velocity.y, this.velocity.x);
        this.hitbox.position = this.shape.position;
        this.hitbox.theta = this.shape.theta;
    }
    update(boids: Boid[], arenaWidth: number, arenaHeight: number) {
        let neighbors: Boid[] = [];

        let accumulatedDirections = new Vector2(0, 0);
        let accumulatedVelocities = new Vector2(0, 0);
        let accumulatedPositions = new Vector2(0, 0);

        let wallRepulsion = new Vector2(0, 0);
        wallRepulsion.x -= 1 / (this.shape.position.x + 1);
        wallRepulsion.y -= 1 / (this.shape.position.y + 1);
        wallRepulsion.x += 1 / (arenaWidth - this.shape.position.x + 1);
        wallRepulsion.y += 1 / (arenaHeight - this.shape.position.y + 1);

        for (let otherBoid of boids) {
            if (otherBoid == this) continue;
            let d = Vector2.distanceSquared(this.shape.position, otherBoid.shape.position);
            let direction = otherBoid.shape.position.subtract(this.shape.position).divide(d);
            let angularDeviation = Math.abs(Math.atan2(direction.y, direction.x) - Math.atan2(this.getForwardDirection().y, this.getForwardDirection().x));
            if (d < this.hitbox.scale ** 2 && angularDeviation < this.hitbox.aperture / 2) {
                neighbors.push(otherBoid);

                accumulatedDirections.addInPlace(this.shape.position.subtract(otherBoid.shape.position));
                accumulatedPositions.addInPlace(otherBoid.shape.position);
                accumulatedVelocities.addInPlace(otherBoid.velocity);
            }
        }

        if (neighbors.length > 0) {
            let meanVelocity = accumulatedVelocities.divide(neighbors.length);

            let avoidanceDirection = accumulatedDirections.divide(neighbors.length).normalize();

            let barycenter = accumulatedPositions.divide(neighbors.length);

            let directionToBarycenter = barycenter.subtract(this.shape.position).normalize();

            this.velocity.normalizeInPlace();
            this.velocity.scaleInPlace(83);
            this.velocity.addInPlace(meanVelocity.scale(10));
            this.velocity.addInPlace(directionToBarycenter.scale(20));
            this.velocity.addInPlace(avoidanceDirection.scale(20));
            this.velocity.normalizeInPlace();
            this.velocity.scaleInPlace(4);

            if (this.velocity.magnitude() > 2) {
                this.velocity.normalizeInPlace();
                this.velocity.scaleInPlace(2);
            }
        }

        this.velocity.addInPlace(wallRepulsion.scale(-10));

        this.move();
    }
}
