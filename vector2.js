export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec2) {
        return new Vector2(this.x + vec2.x, this.y + vec2.y);
    }
    addInPlace(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    subtract(vec2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y);
    }
    divide(diviseur) {
        return new Vector2(this.x / diviseur, this.y / diviseur);
    }
    divideInPlace(diviseur) {
        this.x /= diviseur;
        this.y /= diviseur;
    }
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    scaleInPlace(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    squaredMagnitude() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
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
    static random(scale = 1) {
        let newVector = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
        newVector.normalizeInPlace();
        newVector.scaleInPlace(scale);
        return newVector;
    }
    static distance(vec1, vec2) {
        return vec2.subtract(vec1).magnitude();
    }
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}
