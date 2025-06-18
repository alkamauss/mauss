/** A higher-order function that returns a function to clamp a number between a minimum and maximum value */
export function clamp(min: number, max: number) {
	return (value: number) => Math.max(min, Math.min(value, max));
}

/**
 * The `%` is a remainder operator, this function computes the modulo operation and ensures a non-negative number for a non-negative divisor.
 *
 * @example
 * ```javascript
 * // returns 1
 * modulo(5, 2);
 *
 * // returns 1
 * modulo(-3, 2);
 * ```
 */
export function modulo(a: number, n: number): number {
	return ((a % n) + n) % n;
}
