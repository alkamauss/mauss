import type { AnyFunction } from '../typings/helpers.js';

const DURATION = 300;

/**
 * Creates an async debounced version of `fn` that delays its execution until after `time` milliseconds have passed since the last call.
 *
 * Unlike traditional debounce functions, this version is `await`-able and resolves with the return value of `fn`.
 * @template F a function to debounce
 * @param fn the function to debounce
 * @param time delay in milliseconds (default: 300ms)
 * @returns a debounced async wrapper around `fn`
 * @example
 * ```typescript
 * function sift(name: string) {...}
 *
 * const search = debounce(sift, 500);
 *
 * await search('mauss'); // execute after 500ms
 * ```
 */
export function debounce<F extends AnyFunction>(fn: F, time = DURATION) {
	let timeout: NodeJS.Timeout;
	type Returned = Promise<ReturnType<F>>;
	return async <A extends Parameters<F>>(...args: A): Returned => {
		if (timeout) clearTimeout(timeout);
		await new Promise((fulfil) => {
			timeout = setTimeout(fulfil, time);
		});
		return fn(...args);
	};
}

export async function pause(ms: number): Promise<void> {
	return new Promise((fulfil) => setTimeout(fulfil, ms));
}
