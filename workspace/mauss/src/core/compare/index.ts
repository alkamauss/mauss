import type * as TS from '../../typings/index.js';

export const compare = {
	/** Compares nullish values, sorting `null` and `undefined` to the end */
	undefined(x: unknown, y: unknown): number {
		if (x == null && y == null) return 0;
		return (x == null && 1) || (y == null && -1) || 0;
	},

	/** Compares boolean values, prioritizing `true` over `false` */
	boolean(x: boolean, y: boolean): number {
		return +y - +x;
	},

	/**
	 * Put `(x, y)` for bigger number first, and `(y, x)` for smaller number first
	 * @returns `y - x` which defaults to descending order
	 */
	number(x: number, y: number): number {
		return y - x;
	},

	/** Compares bigint values, defaults to ascending order */
	bigint(x: bigint, y: bigint): number {
		return x < y ? -1 : x > y ? 1 : 0;
	},

	/** Compares symbols using its string values */
	symbol(x: symbol, y: symbol): number {
		return x.toString().localeCompare(y.toString());
	},

	/** Compares string values using `.localeCompare` */
	string(x: string, y: string): number {
		return x.localeCompare(y);
	},

	/** Compares generic object values using {@link inspect} */
	object(x: object, y: object): number {
		if (x === null) return 1;
		if (y === null) return -1;
		return inspect(x, y);
	},
};

type Wildcard = TS.AnyFunction<[x: any, y: any], number>;

/** Compares anything with anything */
export function wildcard(x: any, y: any): number {
	if (x == null) return 1;
	if (y == null) return -1;
	const [xt, yt] = [typeof x, typeof y];
	if (xt === 'function') return 0;

	if (xt !== yt || xt === 'object') {
		const xs = JSON.stringify(x);
		const ys = JSON.stringify(y);
		return compare.string(xs, ys);
	}

	return (compare[xt] as Wildcard)(x, y);
}

/**
 * Recursively compares common object properties until the first difference is found
 * @returns `0` if both objects are identical or completely different, otherwise their respective primitive difference
 */
export function inspect(
	x: Record<TS.IndexSignature, any>,
	y: Record<TS.IndexSignature, any>,
): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k],
	);
	for (
		let i = 0, key = common[i], data = typeof x[key];
		i < common.length && x[key] !== null && y[key] !== null;
		key = common[++i], data = typeof x[key]
	) {
		if (data === 'function') continue;
		if (data === 'object') return inspect(x[key], y[key]);
		const constrained: Wildcard = compare[data];
		if (data in compare) return constrained(x[key], y[key]);
	}
	return 0;
}
