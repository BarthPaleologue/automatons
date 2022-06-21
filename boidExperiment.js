import { Vector2 } from "./vector2.js";
import { Boid } from "./boid.js";
let canvas = document.getElementById("renderer");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d", { alpha: false });
function randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}
let boids = [];
const hitboxRadius = 40;
const hitboxAperture = 2 * Math.PI / 4;
for (let i = 0; i < 1000; i++) {
    let randomPosition = new Vector2(Math.random() * width, Math.random() * height);
    let boid = new Boid(randomPosition, Math.random() * 6.28, 10, hitboxRadius, hitboxAperture, ctx);
    boid.shape.setColor(`#${randomColor()}`);
    let theta = Math.random() * 2 * Math.PI;
    boid.velocity = new Vector2(Math.cos(theta), Math.sin(theta)).scale(100);
    boids.push(boid);
}
let keyboard = {};
let screenX = 0;
let screenY = 0;
function update() {
    ctx.fillStyle = "black";
    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(screenX, screenY, width, height);
    const nbCellsX = 20;
    const nbCellsY = 10;
    let cells = {};
    for (let boid of boids) {
        let x = Math.floor(boid.shape.position.x / nbCellsX);
        let y = Math.floor(boid.shape.position.y / nbCellsY);
        let cell = cells[`${x};${y}`];
        if (cell == undefined)
            cells[`${x};${y}`] = [boid];
        else
            cells[`${x};${y}`].push(boid);
    }
    for (let boid of boids) {
        let x = Math.floor(boid.shape.position.x / nbCellsX);
        let y = Math.floor(boid.shape.position.y / nbCellsY);
        let neighbors = (cells[`${x};${y}`] || []).concat(cells[`${x - 1};${y - 1}`] || [], cells[`${x - 1};${y}`] || [], cells[`${x - 1};${y + 1}`] || [], cells[`${x};${y - 1}`] || [], cells[`${x};${y + 1}`] || [], cells[`${x + 1};${y - 1}`] || [], cells[`${x + 1};${y}`] || [], cells[`${x + 1};${y + 1}`] || []);
        boid.update(neighbors, width, height);
    }
    //drawing boids with only one drawcall
    ctx.beginPath();
    for (let boid of boids)
        boid.shape.draw();
    ctx.closePath();
    ctx.fill();
    //drawing hitboxes with only one drawcall
    ctx.beginPath();
    for (let boid of boids) {
        if (boid.isHitboxDisplayed)
            boid.hitbox.draw();
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();
    listenToKeyboard();
    requestAnimationFrame(update);
}
function listenToKeyboard() {
    if (keyboard["-"]) {
        for (let boid of boids)
            boid.hitbox.aperture -= 0.05;
    }
    if (keyboard["+"]) {
        for (let boid of boids)
            boid.hitbox.aperture += 0.05;
    }
}
document.addEventListener("keydown", e => {
    keyboard[e.key] = true;
    if (e.key == "h") {
        for (let boid of boids)
            boid.isHitboxDisplayed = !boid.isHitboxDisplayed;
    }
});
document.addEventListener("keyup", e => {
    keyboard[e.key] = false;
});
requestAnimationFrame(update);
