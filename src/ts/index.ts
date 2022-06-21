import { Vector2 } from "./utils/vector2";
import { Boid } from "./boid";
import { randomHexColorString } from "./utils/randomHexColorString";

const canvas = document.getElementById("renderer") as HTMLCanvasElement;

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d", { alpha: false })!;

const keyboard: { [key: string]: boolean; } = {};
function listenToKeyboard() {
    if (keyboard["-"]) {
        for (let boid of boids) boid.hitbox.aperture -= 0.05;
    }
    if (keyboard["+"]) {
        for (let boid of boids) boid.hitbox.aperture += 0.05;
    }
}

let boids: Boid[] = [];
const hitboxRadius = 40;
const hitboxAperture = (2 * Math.PI) / 4;

const NB_BOIDS = 300;

for (let i = 0; i < NB_BOIDS; i++) {
    let randomPosition = new Vector2(Math.random() * width, Math.random() * height);
    let boid = new Boid(randomPosition, Math.random() * 6.28, 10, hitboxRadius, hitboxAperture, ctx);
    boid.shape.setColor(`#${randomHexColorString()}`);
    let theta = Math.random() * 2 * Math.PI;
    boid.velocity = new Vector2(Math.cos(theta), Math.sin(theta)).scale(100);
    boids.push(boid);
}

function update() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    const nbCellsX = 5;
    const nbCellsY = 4;

    const cells: { [key: string]: Boid[]; } = {};
    for (const boid of boids) {
        const x = Math.floor(boid.shape.position.x / nbCellsX);
        const y = Math.floor(boid.shape.position.y / nbCellsY);
        const cell = cells[`${x};${y}`];
        if (cell == undefined) cells[`${x};${y}`] = [boid];
        else cells[`${x};${y}`].push(boid);
    }

    for (const boid of boids) {
        const x = Math.floor(boid.shape.position.x / nbCellsX);
        const y = Math.floor(boid.shape.position.y / nbCellsY);
        /*let neighbors = (cells[`${x};${y}`] || []).concat(
            cells[`${x - 1};${y - 1}`] || [],
            cells[`${x - 1};${y}`] || [],
            cells[`${x - 1};${y + 1}`] || [],
            cells[`${x};${y - 1}`] || [],
            cells[`${x};${y + 1}`] || [],
            cells[`${x + 1};${y - 1}`] || [],
            cells[`${x + 1};${y}`] || [],
            cells[`${x + 1};${y + 1}`] || []
        );*/
        boid.update(boids, width, height);
    }

    //drawing boids with only one drawcall
    ctx.beginPath();
    for (let boid of boids) boid.shape.draw();
    ctx.closePath();
    ctx.fill();

    //drawing hitboxes with only one drawcall
    ctx.beginPath();
    for (let boid of boids) {
        if (boid.isHitboxDisplayed) boid.hitbox.draw();
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();

    listenToKeyboard();

    requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
    keyboard[e.key] = true;
    if (e.key == "h") {
        for (let boid of boids) boid.isHitboxDisplayed = !boid.isHitboxDisplayed;
    }
});
document.addEventListener("keyup", e => keyboard[e.key] = false);

requestAnimationFrame(update);