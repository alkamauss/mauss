import { qse } from './index.js';

(/* qs encoder */) => {
	qse({});

	interface SearchParams {
		a: string;
		b: string;
	}
	const search = {} as SearchParams;
	qse(search);

	// ---- errors ----

	// @ts-expect-error - error on empty argument
	qse();
	// @ts-expect-error - error on string type
	qse('');
	// @ts-expect-error - error on non-object type
	qse(null);
};
