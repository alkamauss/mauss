import { augment, iterate } from './index.js';

declare function expect<T>(v: T): void;

(/* augment */) => {
	augment<{}>({});

	// ---- errors ----

	// @ts-expect-error - error on empty argument
	augment();
	// @ts-expect-error - error on non-object type
	augment(null);
};

(/* iterate */) => {
	iterate({ a: 1, b: 2 }, ([k, v], i) => {
		expect<'a' | 'b'>(k);
		expect<number>(v);
		expect<number>(i);
	});
};
