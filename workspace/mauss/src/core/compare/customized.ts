import type * as TS from '../../typings/index.js';
import { wildcard } from './index.js';

type Wildcard = TS.AnyFunction<[x: any, y: any], number>;

/**
 * A higher-order function that accepts an array of strings and returns a comparator function that sorts the strings in the order they appear in the array.
 */
export function arrange(weights: readonly string[]): Wildcard {
	const m: Record<string, number> = {};
	weights.forEach((v, i) => (m[v] = i));
	return (x, y) => m[x] - m[y];
}

type KeyValidator<Keys, Expected> = Keys extends [infer I extends string, ...infer R]
	? Expected & Record<I, KeyValidator<R, I extends keyof Expected ? Expected[I] : never>>
	: Expected;

/**
 * A higher-order function that accepts a string as an identifier and an optional comparator function, it breaks up the identifier described by the dot (`.`) character and returns a curried function that accepts `(x, y)` with an object defined by the identifier.
 *
 * The optional comparator can be used when you have an existing custom sort function, e.g. in combination with `arrange` to sort a set of string.
 *
 * @example
 *
 * ```javascript
 * const posts = [
 * 	{ date: { month: 'March' } },
 * 	{ date: { month: 'June' } },
 * 	{ date: { month: 'May' } },
 * 	{ date: { month: 'April' } },
 * 	{ date: { month: 'January' } },
 * 	{ date: { month: 'June' } },
 * 	{ date: { month: 'February' } },
 * ];
 *
 * const months = [
 * 	'January',
 * 	'February',
 * 	'March',
 * 	'April',
 * 	'May',
 * 	'June',
 * 	'July',
 * 	'August',
 * 	'September',
 * 	'October',
 * 	'November',
 * 	'December',
 * ];
 *
 * posts.sort(drill('date.month', arrange(months)));
 * ```
 */
export function drill<
	Inferred extends Record<TS.IndexSignature, any>,
	Identifier extends keyof Inferred = TS.Paths<Inferred>,
>(identifier: string & Identifier, comparator = wildcard) {
	const trail = identifier.split('.');
	const drill = (o: Inferred) => trail.reduce((ret, prop) => ret[prop], o);

	type Properties = TS.Split<Identifier, '.'>;
	return <X extends Inferred, Y extends Inferred>(
		x: TS.WhenAny<keyof X, X, KeyValidator<Properties, X>>,
		y: TS.WhenAny<keyof Y, Y, KeyValidator<Properties, Y>>,
	) => comparator(drill(x as Inferred), drill(y as Inferred));
}
