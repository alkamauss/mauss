import type { UnaryFunction } from '../typings/helpers.js';
import { debounce } from './index.js';

declare function expect<T>(v: T): void;

(/* debounce */) => {
	const str = (_: string) => {};
	const num = (_: number) => {};
	const name = (_: { name: string }) => {};

	expect<UnaryFunction<string>>(debounce(str));
	expect<UnaryFunction<number>>(debounce(num));
	expect<UnaryFunction<{ name: string }>>(debounce(name));

	// ---- errors ----

	// @ts-expect-error
	expect<UnaryFunction<number>>(debounce(str));
	// @ts-expect-error
	expect<UnaryFunction<string>>(debounce(num));
	// @ts-expect-error
	expect<UnaryFunction<{ name: boolean }>>(debounce(name));
};
