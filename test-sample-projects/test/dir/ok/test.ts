export function randomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min = 0, max = 1): number {
	return Math.random() * (max - min) + min;
}


export function randomBool(p = 0.5): boolean {
	return Math.random() < p;
}

export function randomChoice<T>(arr: T[]): T {
	if (arr.length === 0) throw new Error('randomChoice: empty array');
	return arr[randomInt(0, arr.length - 1)];
}

export function shuffle<T>(arr: T[]): T[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
	let out = '';
	for (let i = 0; i < length; i++) {
		out += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return out;
}

export function uniqueId(prefix = '', length = 8): string {
	return prefix + randomString(length);
}

export function randomColorHex(): string {
	const toHex = (n: number) => n.toString(16).padStart(2, '0');
	return '#' + toHex(randomInt(0, 255)) + toHex(randomInt(0, 255)) + toHex(randomInt(0, 255));
}



export function weightedRandom<T>(items: T[], weights: number[]): T {
	if (items.length === 0) throw new Error('weightedRandom: empty items');
	if (items.length !== weights.length) throw new Error('weightedRandom: items and weights length mismatch');
	const total = weights.reduce((s, w) => s + w, 0);
	if (total <= 0) throw new Error('weightedRandom: non-positive total weight');
	let r = Math.random() * total;
	for (let i = 0; i < items.length; i++) {
		r -= weights[i];
		if (r < 0) return items[i];
	}
	return items[items.length - 1];
}

export function gaussianRandom(mean = 0, stdDev = 1): number {
	let u = 0, v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * stdDev + mean;
}

