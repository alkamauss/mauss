import { describe } from 'vitest';
import * as obj from './index.js';

describe('clone', ({ concurrent: it }) => {
	it('clones any possible data type', ({ expect }) => {
		const base = { arr: [0, 'hi', /wut/], obj: { now: new Date() } };
		const cloned = obj.clone(base);

		expect(base !== cloned).toBe(true);
		expect(base.arr !== cloned.arr).toBe(true);
		expect(base.obj !== cloned.obj).toBe(true);

		expect(base.arr).toEqual(cloned.arr);
		expect(base.obj).toEqual(cloned.obj);
		expect(base.arr[2]).toEqual(cloned.arr[2]);
		expect(base.obj.now).toEqual(cloned.obj.now);
	});
});

describe('iterate', ({ concurrent: it }) => {
	it('iterates over objects', ({ expect }) => {
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

		expect(
			obj.iterate(nested, ([month, v]) => {
				const updated = obj.iterate(v, ([currency, { income, expense }]) => {
					return [currency, { balance: income - expense }];
				});
				return [month, updated];
			}),
		).toEqual(
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

	it('iterate with empty/falsy return', ({ expect }) => {
		expect(obj.iterate({}, ([]) => {})).toEqual({});

		expect(
			obj.iterate(
				{ a: '0', b: 1, c: null, d: '3', e: undefined, f: false },
				([k, v]) => v != null && v !== false && [k, v],
			),
		).toEqual({ a: '0', b: 1, d: '3' });

		type Nested = { [P in 'a' | 'b']?: { [K in 'x' | 'y']: { foo: string } } };
		obj.iterate({ a: { x: { foo: 'ax' } } } as Nested, ([parent, v]) => {
			expect(parent).toBe('a');
			v &&
				obj.iterate(v, ([key, { foo }]) => {
					expect(key).toBe('x');
					expect(foo).toBe('ax');
				});
		});
	});

	it('creates deep copy', ({ expect }) => {
		const original = { x: 1, y: { z: 'foo' } };
		const copy = obj.iterate(original);
		expect(original !== copy).toBe(true);
		expect(original.y !== copy.y).toBe(true);
	});
});
