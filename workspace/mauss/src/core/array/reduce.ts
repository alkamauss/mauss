// aggregations and scans

/**
 * Calculates the mean from a list of numbers using an incremental approach (moving average algorithm), which uses a constant space and updates in constant time. This method helps avoid potential numerical instability issues when dealing with a large sum, such as an integer overflow.
 *
 * @example
 * ```javascript
 * // returns 3
 * average([1, 2, 3, 4, 5]);
 * ```
 */
export function average(numbers: number[]): number {
	let mean = 0;
	for (let i = 0; i < numbers.length; i++) {
		mean += (numbers[i] - mean) / (i + 1);
	}
	return mean;
}

export function count<T>(array: T[], predicate?: (item: T) => boolean): number {
	if (!predicate) return array.length;

	let count = 0;
	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i])) count++;
	}
	return count;
}

/**
 * Find the minimum and maximum values in an array of numbers
 */
export function minmax(array: number[]): [min: number, max: number] {
	if (!array.length) return [0, 0];

	let min = array[0], max = array[0]; // prettier-ignore
	for (let i = 1; i < array.length; i++) {
		min = array[i] < min ? array[i] : min;
		max = array[i] > max ? array[i] : max;
	}
	return [min, max];
}

/**
 * A function that accepts an indexable object.
 * @returns `{ head, last }` of the object
 */
export function sides<T extends string | any[]>(x: T): Record<'head' | 'last', T[0]> {
	return { head: x[0], last: x[x.length - 1] };
}

export function sum(array: number[]): number {
	let total = 0;
	for (let i = 0; i < array.length; i++) {
		total += array[i];
	}
	return total;
}
