/** A convenience function to declare a variable with multiple conditionals to determine its final value, without cluttering the global or top-level scope with temporary variables that are only used once, and avoid nested ternary hell. */
export function scope<T>(fn: () => T) {
	return fn();
}

export { attempt } from './attempt/index.js';
export { date } from './date/index.js';
export { curry, pipe } from './lambda/index.js';
export { immediate, throttle } from './processor/index.js';
export { capitalize, identical, indent, inverse, regexp, sides, unique } from './standard/index.js';
export { catenate, tsf } from './string/index.js';
