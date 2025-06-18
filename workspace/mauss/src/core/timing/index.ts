import type { AnyFunction } from '../../typings/helpers.js';

const DURATION = 300;

/**
 * Immediately execute `fn` and block subsequent calls for `time` ms
 *
 * @example
 * ```js
 * onclick = () => immediate(() => {...}, 500);
 * ```
 */
export function immediate<F extends AnyFunction>(fn: F, time = DURATION) {
	let timeout: NodeJS.Timeout;
	return <A extends Parameters<F>>(...args: A) => {
		if (timeout) return;
		fn(...args);
		timeout = setTimeout(() => clearTimeout(timeout), time);
	};
}

/**
 * Allow `fn` to be called at most once every `time` ms
 *
 * @example
 * ```js
 * const search = throttle((query) => {...}, 500);
 *
 * onclick = () => search('mauss'); // execute every 500ms
 * ```
 */
export function throttle<F extends AnyFunction>(fn: F, time = DURATION) {
	let wait = false;
	return <A extends Parameters<F>>(...args: A) => {
		if (wait) return;
		fn(...args), (wait = true);
		setTimeout(() => (wait = false), time);
	};
}
