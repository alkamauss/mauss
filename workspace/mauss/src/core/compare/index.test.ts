import { arrange, drill } from './customized.js';
import { compare } from './index.js';

(/* compare */) => {
	compare.undefined(null, undefined);
	compare.undefined(undefined, null);
	compare.boolean(true, false);
	compare.boolean(false, true);
	compare.number(1, 2);
	compare.number(2, 1);
	compare.bigint(1n, 2n);
	compare.bigint(2n, 1n);
	compare.symbol(Symbol('a'), Symbol('b'));
	compare.symbol(Symbol('b'), Symbol('a'));
	compare.string('a', 'b');
	compare.string('b', 'a');
	compare.object({}, {});
	compare.object({ a: 1 }, { b: 2 });
	compare.object({ a: 1 }, { a: 1, b: 2 });
	compare.object({ a: 1 }, { a: 1, b: 2, c: 3 });

	// ---- errors ----

	// @ts-expect-error
	compare.boolean(1, 2);
	// @ts-expect-error
	compare.number('a', 'b');
	// @ts-expect-error
	compare.bigint('a', 'b');
	// @ts-expect-error
	compare.symbol('a', 'b');
	// @ts-expect-error
	compare.string(1, 2);
	// @ts-expect-error
	compare.object(1, 2);
	// @ts-expect-error
	compare.object({}, 1);
};

(/* customized */) => {
	let maybe: boolean = false;
	let generic: Record<any, any> = {};
	let unknown: Record<any, unknown> = {};

	drill('name')(generic, generic);
	drill('name')(unknown, unknown);
	drill('name')({ name: 'abc' }, { name: 'def', foo: maybe ? 1 : undefined });
	drill('name', compare.string)({ name: 'abc' }, { name: 'def' });
	drill('name.first', compare.string)(
		{ name: { first: 'abc-xyz' } },
		{ name: { first: 'xyz-def' } },
	);
	drill('date.pub.note')({ date: { pub: { note: 'yay' } } }, { date: { pub: { note: 'yay' } } });

	interface Example {
		name: string;
		date: {
			updated: Date;
			published: Date;
		};
	}
	drill<Example>('date.updated');

	arrange(['a', 'b', 'c', 'e', 'f']);
	arrange(['a', 'b', 'c'] as const);

	// ---- errors ----

	// @ts-expect-error
	drill(1);
	// @ts-expect-error
	drill(Symbol(''));
	// @ts-expect-error
	drill('name')({}, { name: 'abc' });
	// @ts-expect-error
	drill('name')({ name: 'abc' }, {});
	// @ts-expect-error
	drill('name.last')({ name: { first: 'abc' } }, { name: { first: 'def' } });
	// @ts-expect-error
	drill('nope')({ name: 'abc' }, { name: 'def' });
	// @ts-expect-error
	drill('date.pub')({ date: '' }, { date: '' });
	// @ts-expect-error
	drill<Example>('');
	// @ts-expect-error
	drill<Example>('date.updated.valueOf');
};
