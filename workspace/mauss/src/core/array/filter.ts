import { IndexSignature } from '../../typings/aliases.js';
import { Paths } from '../../typings/prototypes.js';

/**
 * A function that accepts an array and returns the same without any duplicate values. This can also handle an array of object by passing in a `key` as an identifier to access the object, with the same behavior as `key` from `'/compare'` module.
 *
 * @param array items to be inspected
 * @returns duplicate-free version of the array input
 */
export function unique<
	Inferred extends Record<IndexSignature, any>,
	Identifier extends Paths<Inferred>,
>(array: readonly Inferred[], key: string & Identifier): Inferred[];
export function unique<T>(array: readonly T[]): T[];
export function unique<T, I>(array: readonly T[], key?: string & I): T[] {
	if (!key || typeof array[0] !== 'object') return [...new Set(array)];

	const trail = key.split('.');
	const filtered = new Map<string, any>();
	for (const item of array as Record<IndexSignature, any>[]) {
		const value: any = trail.reduce((r, p) => (r || {})[p], item);
		if (value && !filtered.has(value)) filtered.set(value, item);
	}
	return [...filtered.values()];
}
