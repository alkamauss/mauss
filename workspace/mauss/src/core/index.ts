/** A convenience function to declare a variable with multiple conditionals to determine its final value, without cluttering the global or top-level scope with temporary variables that are only used once, and avoid nested ternary hell. */
export function scope<T>(fn: () => T) {
	return fn();
}

export { unique } from './array/filter.js';
export { partition } from './array/group.js';
export { average, count, minmax, sides, sum } from './array/reduce.js';
export { binary } from './array/search.js';
export { attempt } from './attempt/index.js';
export { arrange, drill } from './compare/customized.js';
export { identical } from './compare/identical.js';
export { compare, inspect, wildcard } from './compare/index.js';
export { date } from './date/index.js';
export { curry, inverse, pipe } from './lambda/index.js';
export { clamp, modulo } from './number/index.js';
export { clone, iterate } from './object/index.js';
export { random } from './random/index.js';
export { indent } from './string/indent.js';
export { capitalize, catenate, tsf } from './string/index.js';
export { regexp } from './string/regexp.js';
export { immediate, throttle } from './timing/index.js';
