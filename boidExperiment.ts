import { Vector2 } from "./vector2.js";
import { Boid } from "./boid.js";

let canvas = document.getElementById("renderer") as HTMLCanvasElement;

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext("2d")!;

function randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}


let boids: Boid[] = [];
const hitboxRadius = 40;
const hitboxAperture = 5*Math.PI / 4;

for (let i = 0; i < 300; i++) {
    let randomPosition = new Vector2(Math.random() * width, Math.random() * height);
    let boid = new Boid(randomPosition, Math.random() * 6.28, 10, hitboxRadius, hitboxAperture, ctx);
    boid.shape.setColor(`#${randomColor()}`);
    boid.velocity = Vector2.random();
    boids.push(boid);
}

let keyboard: { [key: string]: boolean } = {};

let t = 0;

let screenX = 0;
let screenY = 0;

function update() {
    t += 0.01;
    ctx!.fillStyle = "black";
    ctx?.fillRect(screenX, screenY, width, height);
    for (let boid of boids) {
        let neighbors: Boid[] = [];

        let accumulatedDirections = new Vector2(0, 0);
        let accumulatedVelocities = new Vector2(0, 0);
        let accumulatedPositions = new Vector2(0, 0);

        let wallRepulsion = new Vector2(0, 0);
        wallRepulsion.x -= 1 / (boid.shape.position.x);
        wallRepulsion.y -= 1 / (boid.shape.position.y);
        wallRepulsion.x += 1 / (width - boid.shape.position.x); 
        wallRepulsion.y += 1 / (height - boid.shape.position.y);
        //wallRepulsion.x = wallRepulsion.x ** 3;
        //wallRepulsion.y = wallRepulsion.x ** 3;

        for (let otherBoid of boids) {
            if (otherBoid == boid) continue;
            let d = Vector2.distance(boid.shape.position, otherBoid.shape.position);
            let direction = otherBoid.shape.position.subtract(boid.shape.position).divide(d);
            let angularDeviation = Math.abs(Math.atan2(direction.y, direction.x) - Math.atan2(boid.getForwardDirection().y, boid.getForwardDirection().x));
            if (d < hitboxRadius && angularDeviation < hitboxAperture / 2) {
                //otherBoid.shape.setColor(boid.shape.color);
                neighbors.push(otherBoid);

                accumulatedDirections.addInPlace(boid.shape.position.subtract(otherBoid.shape.position));
                accumulatedPositions.addInPlace(otherBoid.shape.position);
                accumulatedVelocities.addInPlace(otherBoid.velocity);
            }
        }

        if (neighbors.length > 0) {

            let meanVelocity = accumulatedVelocities.divide(neighbors.length);

            let avoidanceDirection = accumulatedDirections.divide(neighbors.length).normalize();

            let barycenter = accumulatedPositions.divide(neighbors.length);

            let directionToBarycenter = barycenter.subtract(boid.shape.position).normalize();

            boid.velocity.normalizeInPlace();
            boid.velocity.scaleInPlace(88);
            boid.velocity.addInPlace(meanVelocity.scale(5));
            boid.velocity.addInPlace(directionToBarycenter.scale(2));
            boid.velocity.addInPlace(avoidanceDirection.scale(5));
            boid.velocity.normalizeInPlace();
            boid.velocity.scaleInPlace(3);
        }

        boid.velocity.addInPlace(wallRepulsion.scale(-10));

        boid.move();

        boid.draw();
    }
    listenToKeyboard();
}

function listenToKeyboard() {
    let speed = 2;
    if (keyboard["z"]) {
        screenY -= speed;
        ctx.translate(0, speed);
    }
    if (keyboard["q"]) {
        screenX -= speed;
        ctx.translate(speed, 0);
    }
    if (keyboard["s"]) {
        screenY += speed;
        ctx.translate(0, -speed);
    }
    if (keyboard["d"]) {
        screenX += speed;
        ctx.translate(-speed, 0);
    }
}

setInterval(update, 1000 / 60);

document.addEventListener("keydown", e => {
    keyboard[e.key] = true;
});
document.addEventListener("keyup", e => {
    keyboard[e.key] = false;
});