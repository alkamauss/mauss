import type { UnaryFunction } from '../../typings/helpers.js';

/**
 * Binary search algorithm on a sorted array
 * @returns the first item that passes the check
 */
export function binary<T>(
	sorted: T[],
	check: {
		item: UnaryFunction<T, false | UnaryFunction<T>>;
		pointer: UnaryFunction<T, boolean>;
	},
): T | undefined {
	let start = 0, final = sorted.length - 1; // prettier-ignore
	while (start <= final) {
		const midpoint = (start + final) >> 1;
		const current = sorted[midpoint];
		const passes = check.item(current);
		if (passes) return passes(current);
		const flag = check.pointer(current);
		start = flag ? start : midpoint + 1;
		final = flag ? midpoint - 1 : final;
	}
	return;
}
