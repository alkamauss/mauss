import { iterate } from './index.js';

declare function expect<T>(v: T): void;

(/* iterate */) => {
	iterate({ a: 1, b: 2 }, ([k, v], i) => {
		expect<'a' | 'b'>(k);
		expect<number>(v);
		expect<number>(i);
	});
};
