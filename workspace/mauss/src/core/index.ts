/** A convenience function to declare a variable with multiple conditionals to determine its final value, without cluttering the global or top-level scope with temporary variables that are only used once, and avoid nested ternary hell. */
export function scope<T>(fn: () => T) {
	return fn();
}

export { partition } from './array/group.js';
export { average, count, minmax, sum } from './array/reduce.js';
export { binary } from './array/search.js';
export { attempt } from './attempt/index.js';
export { date } from './date/index.js';
export { curry, pipe } from './lambda/index.js';
export { clamp, modulo } from './number/index.js';
export { random } from './random/index.js';
export { capitalize, identical, indent, inverse, regexp, sides, unique } from './standard/index.js';
export { catenate, tsf } from './string/index.js';
export { immediate, throttle } from './timing/index.js';
