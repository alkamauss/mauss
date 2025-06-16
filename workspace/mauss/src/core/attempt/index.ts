import { AnyFunction } from '../../typings/helpers.js';

/**
 * A function that will execute a `work` asynchronously and will not throw an error.
 *
 * @param work a function with an asynchronous operation
 * @template T the type of the data returned by the promise
 * @returns an object with either `data` or `error` property
 * @example
 * ```typescript
 * const { data, error } = await attempt(async () => {
 *   // some async operation
 *   return 'result';
 * });
 * if (error) { // could also be `data`
 *   // log error or do other things
 * }
 * ```
 */
export async function attempt<T>(work: () => Promise<T>): Promise<{ data?: T; error?: unknown }> {
	try {
		return { data: await work() };
	} catch (error) {
		return { error };
	}
}
/**
 * A function that will execute a `work` synchronously and will not throw an error.
 *
 * @param work a function with a synchronous operation
 * @template T the type of the data returned by the function
 * @returns an object with either `data` or `error` property
 * @example
 * ```typescript
 * const { data, error } = attempt(() => {
 *   // some sync operation
 *   return 'result';
 * });
 * if (error) { // could also be `data`
 *   // log error or do other things
 * }
 * ```
 */
attempt.sync = function <T>(work: () => T): { data?: T; error?: unknown } {
	try {
		return { data: work() };
	} catch (error) {
		return { error };
	}
};
/**
 * Wrap a function in an `attempt`, allowing it to safely execute without throwing an error.
 * @param fn a function that will be wrapped
 * @template F the type of the function to be wrapped
 * @returns an object with either `data` or `error` property
 * @example
 * ```typescript
 * const parse = attempt.wrap(JSON.parse);
 * const { data, error } = parse('{"key": "value"}');
 * if (data) { // could also be `error`
 *   // use data or do other things
 * }
 * ```
 */
attempt.wrap = function <F extends AnyFunction>(fn: F) {
	return (...args: Parameters<F>): { data?: ReturnType<F>; error?: unknown } => {
		try {
			return { data: fn(...args) };
		} catch (error) {
			return { error };
		}
	};
};
