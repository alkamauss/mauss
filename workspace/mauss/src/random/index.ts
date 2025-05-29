import type { IndexSignature, TypedIntArray } from '../typings/aliases.js';

/**
 * Generates a random floating point number between `min` and `max`
 * @default max=1
 * @default min=0
 */
export function float(max = 1, min = 0): number {
	[min, max] = [Math.ceil(min), Math.floor(max)];
	return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between `min` and `max`
 * @default max=1
 * @default min=0
 */
export function int(max = 1, min = 0): number {
	return Math.floor(float(max, min));
}

/** Generates a random boolean value */
export function bool(): boolean {
	return float() < 0.5;
}

/** Generates an array of random integers */
export function array(length: number, max: number, min = 0): number[] {
	return Array.from({ length }, () => int(max, min));
}

/** Gets a random property from an object */
export function key(dict: Record<IndexSignature, any>): string {
	const keys = Object.keys(dict);
	return keys[int(keys.length)];
}

/** Gets a value of a random property from an object */
export function val<T>(dict: Record<IndexSignature, T>): T {
	const values = Object.values(dict);
	return values[int(values.length)];
}

/** Gets a random item from a list */
export function item<T>(list: T[]): T {
	return list[int(list.length)];
}

/** Generates a random hexadecimal color code */
export function hex(): string {
	return `#${~~(float() * (1 << 24)).toString(16)}`;
}

/** Generates a random IPv4 address */
export function ipv4(): string {
	return [0, 1, 2, 3].map((i) => int(255) + (!i ? 1 : 0)).join('.');
}

interface WebCryptoMethods {
	getRandomValues(array: TypedIntArray): TypedIntArray;
	randomUUID(): string;
}
/** Generates a random UUID */
export function uuid<Generator extends WebCryptoMethods>(gen?: Generator): string {
	if (gen && typeof gen.randomUUID === 'function') return gen.randomUUID();
	return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) => {
		const rng = gen ? gen.getRandomValues(new Uint8Array(1))[0] : float(16);
		return (+c ^ ((Number(rng) & 15) >> (+c / 4))).toString(16);
	});
}
