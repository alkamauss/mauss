import { describe } from 'vitest';
import { identical } from './identical.js';

describe('identical', ({ concurrent: it }) => {
	it('primitive checks', ({ expect }) => {
		expect(identical(true, true)).toBe(true);
		expect(identical(true, false)).toBe(false);

		expect(identical('a', 'a')).toBe(true);
		expect(identical('a', 'b')).toBe(false);

		expect(identical(1, 1)).toBe(true);
		expect(identical(1, 2)).toBe(false);

		expect(identical(0n, 0n)).toBe(true);
		expect(identical(1n, 1n)).toBe(true);
		expect(identical(0n, 1n)).toBe(false);
		expect(identical(0n, 0)).toBe(false);
		expect(identical(0n, 1)).toBe(false);
		expect(identical(1n, 0)).toBe(false);
		expect(identical(1n, 1)).toBe(false);

		expect(identical(Symbol('abc'), Symbol('abc'))).toBe(true);
		expect(identical(Symbol(0), Symbol('foo'))).toBe(false);

		expect(identical(null, null)).toBe(true);
		expect(identical(undefined, undefined)).toBe(true);
		expect(identical(null, undefined)).toBe(false);
		expect(identical(undefined, 0)).toBe(false);
		expect(identical(undefined, '')).toBe(false);

		expect(
			identical(
				() => {},
				() => {},
			),
		).toBe(true);
		expect(
			identical(
				() => '',
				() => 0,
			),
		).toBe(true);
	});

	it('array checks', ({ expect }) => {
		expect(identical([], [])).toBe(true);
		expect(identical(['', 1, !0], ['', 1, !0])).toBe(true);
		expect(identical([{ x: [] }], [{ x: [] }])).toBe(true);
		expect(identical(['', 0, !0], ['', 1, !1])).toBe(false);
		expect(identical([{ x: [] }], [{ y: [] }])).toBe(false);
	});

	it('object checks', ({ expect }) => {
		expect(identical({}, {})).toBe(true);
		expect(identical({ a: '', b: 1, c: !0 }, { a: '', b: 1, c: !0 })).toBe(true);
		expect(identical({ x: [{}], y: { a: 0 } }, { x: [{}], y: { a: 0 } })).toBe(true);
	});

	it('clone', async ({ expect }) => {
		const { clone } = await import('../object/index.js');
		const data = { a: [1, '', {}], o: { now: new Date() } };
		expect(identical(data, clone(data))).toBe(true);
	});
});
