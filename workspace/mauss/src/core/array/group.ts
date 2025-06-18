export function partition<T>(
	array: T[],
	predicate: (item: T) => boolean,
): [included: T[], excluded: T[]] {
	const inc: T[] = [];
	const exc: T[] = [];
	for (const item of array) {
		(predicate(item) ? inc : exc).push(item);
	}
	return [inc, exc];
}
