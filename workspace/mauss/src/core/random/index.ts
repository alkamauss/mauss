import type { IndexSignature } from '../../typings/aliases.js';

export const random = {
	/**
	 * Generates a random floating point number between `min` and `max` (exclusive)
	 * @default min=0
	 * @default max=1
	 */
	float(min = 0, max = 1): number {
		return Math.random() * (max - min) + min;
	},

	/**
	 * Generates a random integer between `min` and `max` (inclusive)
	 * @default min=0
	 * @default max=1
	 */
	int(min = 0, max = 1): number {
		const lower = Math.ceil(Math.min(min, max));
		const upper = Math.floor(Math.max(min, max));
		return Math.floor(Math.random() * (upper - lower + 1)) + lower;
	},

	/** Returns a random boolean value */
	get bool(): boolean {
		return random.int() === 1;
	},

	/** Returns an array of random integers */
	array(length: number, min = 0, max = 1): number[] {
		return Array.from({ length }, () => random.int(min, max));
	},

	/** Picks a random enumerable string key from a dictionary */
	key(dict: Record<IndexSignature, any>): string {
		const keys = Object.keys(dict);
		return keys[random.int(0, keys.length - 1)];
	},

	/** Picks a random value from the object's enumerable string keys */
	val<T>(dict: Record<IndexSignature, T>): T {
		const values = Object.values(dict);
		return values[random.int(0, values.length - 1)];
	},

	/** Picks a random item from an array */
	item<T>(list: T[]): T {
		return list[random.int(0, list.length - 1)];
	},

	/** Returns a random 6-digit hexadecimal color code */
	get hex(): string {
		return `#${random.int(0, 0xffffff).toString(16).padStart(6, '0')}`;
	},

	/** Generates a random IPv4 address */
	get ipv4(): string {
		// avoid 0.0.0.0 and 255.255.255.255
		return [random.int(1, 254), random.int(0, 255), random.int(0, 255), random.int(1, 254)].join(
			'.',
		);
	},

	/** Generates a random UUID v4 */
	uuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = random.int(0, 15);
			return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
	},
};
