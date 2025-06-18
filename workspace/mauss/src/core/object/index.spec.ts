import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as obj from './index.js';

const suites = {
	'object/clone': suite('object/clone'),
	'object/iterate': suite('object/iterate'),
};

suites['object/clone']('clone any possible data type', () => {
	const base = { arr: [0, 'hi', /wut/], obj: { now: new Date() } };
	const cloned = obj.clone(base);

	assert.ok(base !== cloned);
	assert.ok(base.arr !== cloned.arr);
	assert.ok(base.obj !== cloned.obj);

	assert.equal(base.arr, cloned.arr);
	assert.equal(base.obj, cloned.obj);
	assert.equal(base.arr[2], cloned.arr[2]);
	assert.equal(base.obj.now, cloned.obj.now);
});

suites['object/iterate']('iterate over nested objects', () => {
	const months = 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'.split(',');
	const currencies = 'usd,eur,sgd,gbp,aud,jpy'.split(',');

	const statement = currencies.reduce(
		(cs, c) => ({ ...cs, [c]: { income: 100, expense: 40 } }),
		{} as { [k: string]: { income: number; expense: number } },
	);
	const nested = months.reduce(
		(ms, m) => ({ ...ms, [m]: statement }),
		{} as { [k: string]: typeof statement },
	);

	assert.equal(
		obj.iterate(nested, ([month, v]) => {
			const updated = obj.iterate(v, ([currency, { income, expense }]) => {
				return [currency, { balance: income - expense }];
			});
			return [month, updated];
		}),
		months.reduce((a, m) => {
			// @ts-ignore
			a[m] = {
				usd: { balance: 60 },
				eur: { balance: 60 },
				sgd: { balance: 60 },
				gbp: { balance: 60 },
				aud: { balance: 60 },
				jpy: { balance: 60 },
			};
			return a;
		}, {}),
	);
});
suites['object/iterate']('iterate with empty/falsy return', () => {
	assert.equal(
		obj.iterate({}, ([]) => {}),
		{},
	);

	assert.equal(
		obj.iterate(
			{ a: '0', b: 1, c: null, d: '3', e: undefined, f: false },
			([k, v]) => v != null && v !== false && [k, v],
		),
		{ a: '0', b: 1, d: '3' },
	);

	type Nested = { [P in 'a' | 'b']?: { [K in 'x' | 'y']: { foo: string } } };
	obj.iterate({ a: { x: { foo: 'ax' } } } as Nested, ([parent, v]) => {
		assert.equal(parent, 'a');
		v &&
			obj.iterate(v, ([key, { foo }]) => {
				assert.equal(key, 'x');
				assert.equal(foo, 'ax');
			});
	});
});
suites['object/iterate']('iterate creates deep copy', () => {
	const original = { x: 1, y: { z: 'foo' } };
	const copy = obj.iterate(original);
	assert.ok(original !== copy);
	assert.ok(original.y !== copy.y);
});

Object.values(suites).forEach((v) => v.run());
