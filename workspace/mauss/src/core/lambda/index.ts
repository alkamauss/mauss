import type { AnyFunction, Last, UnaryFunction } from '../../typings/helpers.js';
import type { Progressive, Slice } from '../../typings/prototypes.js';

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

type Currying<Fun extends AnyFunction> = <Arguments extends Progressive<Parameters<Fun>>>(
	...args: Arguments
) => Arguments['length'] extends Parameters<Fun>['length']
	? ReturnType<Fun>
	: Currying<(...args: Slice<Parameters<Fun>, Arguments['length']>) => ReturnType<Fun>>;

/**
 * A type-safe higher-order function that accepts a function with one or more parameters and returns a function that can take in one or more arguments with a max of the parameters length.
 * If the total arguments provided has not yet reached the initial function parameters length, it will return a function until all the required parameters are fulfilled.
 *
 * @returns a curried function to take in the arguments
 */
export function curry<F extends AnyFunction>(fn: F, expected = fn.length): Currying<F> {
	return <Arguments extends Progressive<Parameters<F>>>(...args: Arguments) => {
		if (args.length === expected) return fn(...args);
		if (args.length > expected) return fn(...args.slice(0, expected));
		return curry((...next) => fn(...[...args, ...next]), expected - args.length);
	};
}

type Validator<
	Functions extends UnaryFunction[],
	Computed extends UnaryFunction = (v: ReturnType<Functions[0]>) => ReturnType<Functions[1]>,
> = Functions extends [infer Resolved, infer _, ...infer Rest]
	? Rest extends UnaryFunction[]
		? [Resolved, ...Validator<[Computed, ...Rest]>]
		: never // will never reach here, condition always satisfies
	: Functions;

/**
 * A type-safe higher-order function that accepts any number of arguments, it returns a function with the parameters of the first function passed and a return type/value of the last function.
 *
 * @returns a function that takes in the initial type and returns the final type
 */
export function pipe<F extends UnaryFunction[]>(...functions: Validator<F>) {
	type InitialType = Parameters<F[0]>[0];
	type FinalType = ReturnType<Last<F, any>>;
	return (arg: InitialType): FinalType => {
		let pipeline = arg;
		for (let i = 0; i < functions.length; i++) {
			pipeline = functions[i](pipeline);
		}
		return pipeline;
	};
}
