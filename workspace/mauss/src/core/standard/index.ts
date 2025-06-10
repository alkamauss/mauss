import type { IndexSignature } from '../../typings/aliases.js';
import type { AnyFunction, Reverse } from '../../typings/helpers.js';
import type { Paths } from '../../typings/prototypes.js';

interface CapitalizeOptions {
	/** only capitalize the very first letter */
	cap?: boolean;
	/** convert the remaining word to lowercase */
	normalize?: boolean;
}
/**
 * A function that accepts a string and returns the same with the first letter of each word capitalized. This can also be used to capitalize only the first letter of the entire string, or normalize the entire string to lowercase before capitalizing.
 */
export function capitalize(text: string, { cap, normalize }: CapitalizeOptions = {}): string {
	if (normalize) text = text.toLowerCase();
	if (cap) return `${text[0].toUpperCase()}${text.slice(1)}`;
	return text.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

/**
 * A function to check for value equality between two variables. This will work for any data type except `function`, which will always return `true` when two function are being compared. The heuristics are as follows:
 * - fails immediately when the type of `x` and `y` are not the same
 * - type of `function` are not comparable, always returns true
 * - type of `symbol` is converted and compared as a `string`
 * - primitive values are compared using strict equality operator
 * - type of `object`, two empty array or object are considered the same
 * - type of `object`, comparing array also considers its length and item order
 * - type of `object`, two object must have the same keys before comparing its values
 * - type of `object`, the order of key-value pair does not matter for equality check
 * - `identical` is infinitely recursive for any amount of nested array/object
 */
export function identical(x: unknown, y: unknown): boolean {
	const [xt, yt] = [typeof x, typeof y];
	if (xt !== yt) return false;
	if (xt === 'function') return true;
	if (xt === 'symbol') {
		// @ts-expect-error - guaranteed symbol
		return x.toString() === y.toString();
	}

	if (xt !== 'object') return x === y;
	if (x == null || y == null) return x === y;

	if (Array.isArray(x) !== Array.isArray(y)) return false;
	if (Array.isArray(x) && Array.isArray(y)) {
		if (x.length !== y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (!identical(x[i], y[i])) return false;
		}
		return true;
	}

	const [xk, yk] = [Object.keys(x), Object.keys(y)];
	const keys = new Set([...xk, ...yk]);
	if (xk.length !== yk.length || keys.size !== xk.length) return false;
	for (const k of keys) {
		// @ts-expect-error - guaranteed indexable
		if (!identical(x[k], y[k])) return false;
	}
	return true;
}

/**
 * A function to work with template strings and removes indentation based on the first line. This is useful when the template string is written with indentation for better readability, but the indentation is not desired in the final output.
 */
export function indent(text: string) {
	const lines = text.split(/\r?\n/).filter((l) => l.trim());
	const depth = (/^\s*/.exec(lines[0]) || [''])[0].length;
	return {
		depth,
		trim() {
			return lines.map((l) => l.slice(depth)).join('\n');
		},
	};
}

/**
 * A function that accepts a function and returns the same function with the order of parameters reversed. This can be used in conjunction with `compare` methods to sort the items in ascending values.
 *
 * @param fn any function with one or more arguments
 * @returns a curried function to take in the arguments
 */
export function inverse<Function extends AnyFunction>(fn: Function) {
	type Reversed = Reverse<Parameters<Function>>;
	type Returned = ReturnType<Function>;
	return (...parameters: Reversed): Returned => fn(...parameters.reverse());
}

/**
 * A drop-in replacement for `new RegExp()` with special characters from source string escaped. This is useful when the pattern is not known at compile time and is dynamically constructed.
 *
 * @param pattern passed in the form of string literal
 * @param flags unique set of characters from `d|g|i|m|s|u|y`
 * @returns dynamically constructed RegExp object
 */
export function regexp(pattern: string, flags?: string): RegExp {
	return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}

/**
 * A function that accepts an indexable object.
 * @returns `{ head, last }` of the object
 */
export function sides<T extends string | any[]>(x: T): Record<'head' | 'last', T[0]> {
	return { head: x[0], last: x[x.length - 1] };
}

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
