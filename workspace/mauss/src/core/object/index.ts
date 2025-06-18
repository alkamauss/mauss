import type { Falsy, IndexSignature } from '../../typings/aliases.js';
import type { AnyFunction, Entries } from '../../typings/helpers.js';

/**
 * Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other
 * @returns a deep copy of the object input
 */
export function clone<T>(i: T): T {
	if (!i || typeof i !== 'object') return i;
	if (Array.isArray(i)) return i.map(clone) as T;
	const type = Object.prototype.toString.call(i);
	if (type !== '[object Object]') return i;
	return iterate(i) as T;
}

/**
 * Iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behavior will create a deep copy of the original object
 *
 * The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored, i.e. `void | Falsy`
 */
export function iterate<T extends object, I = T[keyof T]>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, I]
	> = ([k, v]) => [k, clone(v) as I],
): I extends T[keyof T] ? T : unknown {
	const pairs = Object.entries(object) as Entries<T>;
	const memo: typeof pairs = [];
	for (let i = 0; i < pairs.length; i++) {
		const res = callback(pairs[i], i);
		if (!res || res.length !== 2) continue;
		memo.push(res as (typeof memo)[number]);
	}
	return Object.fromEntries(memo) as any;
}
