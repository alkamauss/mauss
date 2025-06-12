import type { UnaryFunction } from '../../typings/helpers.js';
import { throttle } from './index.js';

declare function expect<T>(v: T): void;

const str = (_: string) => {};
const num = (_: number) => {};
const name = (_: { name: string }) => {};

expect<UnaryFunction<string>>(throttle(str));
expect<UnaryFunction<number>>(throttle(num));
expect<UnaryFunction<{ name: string }>>(throttle(name));

// ---- errors ----

// @ts-expect-error
expect<UnaryFunction<number>>(throttle(str));
// @ts-expect-error
expect<UnaryFunction<string>>(throttle(num));
// @ts-expect-error
expect<UnaryFunction<{ name: boolean }>>(throttle(name));
