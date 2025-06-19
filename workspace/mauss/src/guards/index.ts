import type { Nullish, Falsy, FullPrimitives as Primitives } from '../typings/aliases.js';

/**
 * A guard for exhaustive checks with `if`/`else`/`switch` statements, this will help branching logic in consuming enumeration and union types.
 *
 * @example
 *
 * ```typescript
 * let key = 'a' as 'a' | 'z';
 * switch (key) {
 * 	case 'a':
 * 		return key.charCodeAt();
 * 	default:
 * 		// Argument of type 'string' is not assignable to parameter of type 'never'.
 * 		return bulwark(key);
 * }
 * ```
 */
export function bulwark(nothing: never) {
	throw new Error(`UncaughtError: reached forbidden guard with ${JSON.stringify(nothing)}`);
}

type Empty = '' | Nullish;

/** @returns true if input is not `nullish` or an empty string */
export function exists<T>(i: T | Empty): i is T {
	return !nullish(i) && i !== '';
}
/** @returns true if input is `null` or `undefined` */
export function nullish<T>(i: T | Primitives): i is T {
	return i == null;
}
/** @returns true if input is truthy in general */
export function truthy<T>(i: T | Falsy): i is T {
	return !!i;
}

// number guards
/** @returns true if input exists or is a number greater than 0 */
export function natural<T>(i: T | Empty): i is T {
	return typeof i === 'number' ? i > 0 : exists(i);
}
/** @returns true if input exists or is a number greater than or equal to 0 */
export function whole<T>(i: T | Empty): i is T {
	return typeof i === 'number' ? i >= 0 : exists(i);
}

// currying utilities
type ValidNegatives = typeof exists | typeof nullish | typeof truthy;
/** @returns negation of the guard function passed, e.g. `not(nullish)` */
export function not<F extends ValidNegatives>(fn: F) {
	type D = F extends typeof exists ? Primitives : F extends typeof nullish ? Nullish : Empty;
	return <T>(i: T | D): i is T => !fn(i);
}

// string guards
/** @returns true if string input is all lowercase letters */
export function lowercase(s: string): boolean {
	return s === s.toLowerCase();
}
/** @returns true if string input is all uppercase letters */
export function uppercase(s: string): boolean {
	return s === s.toUpperCase();
}
