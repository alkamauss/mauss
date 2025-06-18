/**
 * A function to check for value equality between two variables. This will work for any data type except `function`, which will always return `true` when two function are being compared. The heuristics are as follows:
 * - fails immediately when the type of `x` and `y` are not the same
 * - type of `function` are not comparable, always returns true
 * - type of `symbol` is converted and compared as a `string`
 * - primitive values are compared using strict equality operator
 * - type of `object`, two empty array or object are considered the same
 * - type of `object`, comparing array also considers its length and item order
 * - type of `object`, two object must have the same keys before comparing its values
 * - type of `object`, the order of key-value pair does not matter for equality check
 * - `identical` is infinitely recursive for any amount of nested array/object
 */
export function identical(x: unknown, y: unknown): boolean {
	const [xt, yt] = [typeof x, typeof y];
	if (xt !== yt) return false;
	if (xt === 'function') return true;
	if (xt === 'symbol') {
		// @ts-expect-error - guaranteed symbol
		return x.toString() === y.toString();
	}

	if (xt !== 'object') return x === y;
	if (x == null || y == null) return x === y;

	if (Array.isArray(x) !== Array.isArray(y)) return false;
	if (Array.isArray(x) && Array.isArray(y)) {
		if (x.length !== y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (!identical(x[i], y[i])) return false;
		}
		return true;
	}

	const [xk, yk] = [Object.keys(x), Object.keys(y)];
	const keys = new Set([...xk, ...yk]);
	if (xk.length !== yk.length || keys.size !== xk.length) return false;
	for (const k of keys) {
		// @ts-expect-error - guaranteed indexable
		if (!identical(x[k], y[k])) return false;
	}
	return true;
}
