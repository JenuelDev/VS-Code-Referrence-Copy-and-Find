"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = randomInt;
exports.randomFloat = randomFloat;
exports.randomBool = randomBool;
exports.randomChoice = randomChoice;
exports.shuffle = shuffle;
exports.randomString = randomString;
exports.uniqueId = uniqueId;
exports.randomColorHex = randomColorHex;
exports.weightedRandom = weightedRandom;
exports.gaussianRandom = gaussianRandom;
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function randomBool(p = 0.5) {
    return Math.random() < p;
}
function randomChoice(arr) {
    if (arr.length === 0)
        throw new Error('randomChoice: empty array');
    return arr[randomInt(0, arr.length - 1)];
}
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
}
function uniqueId(prefix = '', length = 8) {
    return prefix + randomString(length);
}
function randomColorHex() {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return '#' + toHex(randomInt(0, 255)) + toHex(randomInt(0, 255)) + toHex(randomInt(0, 255));
}
function weightedRandom(items, weights) {
    if (items.length === 0)
        throw new Error('weightedRandom: empty items');
    if (items.length !== weights.length)
        throw new Error('weightedRandom: items and weights length mismatch');
    const total = weights.reduce((s, w) => s + w, 0);
    if (total <= 0)
        throw new Error('weightedRandom: non-positive total weight');
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r < 0)
            return items[i];
    }
    return items[items.length - 1];
}
function gaussianRandom(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}
//# sourceMappingURL=test.js.map