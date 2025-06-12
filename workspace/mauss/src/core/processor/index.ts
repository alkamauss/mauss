import type { AnyFunction } from '../../typings/helpers.js';

const DURATION = 300;

/**
 * Immediately execute `fn` and prevent the next execution until after `time`
 *
 * @example
 *
 * ```js
 * function update(name) {...}
 *
 * const onclick = immediate(update, 500);
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
 * Prevent executions after the first `fn` until `time` has passed
 *
 * @example
 *
 * ```js
 * function update(name) {...}
 *
 * const search = throttle(update, 500);
 *
 * search('mauss'); // execute every 500ms
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
