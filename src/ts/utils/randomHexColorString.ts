/**
 * Returns a random hexadecimal string of a color (without a # at the start)
 * @param rand the rng (should return a value between 0 and 1) defaults to Math.random
 * @returns 
 */
export function randomHexColorString(rand = Math.random) {
    return Math.floor(Math.random() * 16777215).toString(16);
}