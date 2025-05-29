import type { AnyFunction } from '../typings/helpers.js';

const DURATION = 300;

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

export async function pause(ms: number): Promise<string> {
	return new Promise((fulfil) => setTimeout(fulfil, ms));
}
