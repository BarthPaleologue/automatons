export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    add(vec2: Vector2) {
        return new Vector2(this.x + vec2.x, this.y + vec2.y);
    }
    addInPlace(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;
    }
    subtract(vec2: Vector2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y);
    }
    divide(diviseur: number) {
        return new Vector2(this.x / diviseur, this.y / diviseur);
    }
    divideInPlace(diviseur: number) {
        this.x /= diviseur;
        this.y /= diviseur;
    }
    scale(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    scaleInPlace(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }
    squaredMagnitude() {
        return this.x ** 2 + this.y ** 2;
    }
    magnitude() {
        return Math.sqrt(this.squaredMagnitude());
    }
    normalize() {
        return this.divide(this.magnitude());
    }
    normalizeInPlace() {
        this.divideInPlace(this.magnitude());
    }
    static random(scale = 1): Vector2 {
        let newVector = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
        newVector.normalizeInPlace();
        newVector.scaleInPlace(scale);
        return newVector;
    }
    static distance(vec1: Vector2, vec2: Vector2): number {
        return vec2.subtract(vec1).magnitude();
    }
    static distanceSquared(vec1: Vector2, vec2: Vector2): number {
        return vec2.subtract(vec1).squaredMagnitude();
    }
    static dot(vec1: Vector2, vec2: Vector2): number {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}
