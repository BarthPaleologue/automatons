import { Vector2 } from "./utils/vector2";
import { Boid } from "./boid";
import { randomHexColorString } from "./utils/randomHexColorString";
import { randRange } from "../../node_modules/extended-random/index.js";
import { Settings } from "./settings";

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

const boids: Boid[] = [];
const hitboxAperture = (2 * Math.PI) / 4;

for (let i = 0; i < Settings.nbBoids; i++) {
    const randomPosition = new Vector2(randRange(width / 3, 2 * width / 3), randRange(height / 3, 2 * height / 3));
    let boid = new Boid(randomPosition, Math.random() * 6.28, 10, Settings.hitRadius, hitboxAperture, ctx);
    boid.shape.setColor(`#${randomHexColorString()}`);
    let theta = Math.random() * 2 * Math.PI;
    boid.velocity = new Vector2(Math.cos(theta), Math.sin(theta));
    boids.push(boid);
}

function update() {

    const nbCellsX = 5;
    const nbCellsY = 4;

    const cells: Boid[][][] = new Array<Boid[][]>(nbCellsX);
    for (let x = 0; x < nbCellsX; x++) {
        cells[x] = new Array<Boid[]>(nbCellsY);
        for (let y = 0; y < nbCellsY; y++) cells[x][y] = [];
    }

    for (const boid of boids) {
        const x = Math.floor((nbCellsX * boid.shape.position.x) / width);
        const y = Math.floor((nbCellsY * boid.shape.position.y) / height);
        if (x < 0 || x >= nbCellsX) throw new Error("X coord out of bound");
        if (y < 0 || y >= nbCellsY) throw new Error("Y coord out of bound");
        cells[x][y].push(boid);
    }

    for (const boid of boids) {
        const x = Math.floor((nbCellsX * boid.shape.position.x) / width);
        const y = Math.floor((nbCellsY * boid.shape.position.y) / height);

        /*let neighbors = cells[x][y].concat(
            cells[x - 1][y - 1],
            cells[x - 1][y],
            cells[x - 1][y + 1],
            cells[x][y - 1],
            cells[x][y + 1],
            cells[x + 1][y - 1],
            cells[x + 1][y],
            cells[x + 1][y + 1]
        );*/
        boid.update(boids, width, height);
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

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

document.addEventListener("keydown", (e) => {
    keyboard[e.key] = true;
    if (e.key == "h") {
        for (let boid of boids) boid.isHitboxDisplayed = !boid.isHitboxDisplayed;
    }
});
document.addEventListener("keyup", (e) => (keyboard[e.key] = false));

requestAnimationFrame(update);
