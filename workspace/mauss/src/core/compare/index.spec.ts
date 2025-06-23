import { describe } from 'vitest';
import { compare, inspect } from './index.js';

describe('compare', ({ concurrent: it }) => {
	it('sort undefined values with null values above', ({ expect }) => {
		expect(
			[undefined, 3, 0, null, 1, -1, undefined, -2, undefined, null].sort(compare.undefined),
		).toEqual([3, 0, 1, -1, -2, null, null, undefined, undefined, undefined]);
	});
	it('sort boolean values with true above', ({ expect }) => {
		expect(
			[true, false, true, false, true, false, true, false, true, false].sort(compare.boolean),
		).toEqual([true, true, true, true, true, false, false, false, false, false]);
	});
	it('sort number in descending order', ({ expect }) => {
		expect([5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number)).toEqual([
			9, 6, 5, 4, 3, 2, 1, 0, -1, -2,
		]);
	});
	it('sort bigint in ascending order', ({ expect }) => {
		expect([5n, 3n, 10n, 0n, 1n, -2n].sort(compare.bigint)).toEqual([-2n, 0n, 1n, 3n, 5n, 10n]);
	});
	it('sort string in alphabetical order', ({ expect }) => {
		expect(
			['k', 'h', 'g', 'f', 'e', 'l', 'd', 'm', 'c', 'b', 'j', 'i', 'a'].sort(compare.string),
		).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']);
		expect(
			['K', 'H', 'G', 'F', 'E', 'L', 'D', 'M', 'C', 'B', 'J', 'I', 'A'].sort(compare.string),
		).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']);
	});
	it('sort symbol in ascending order', ({ expect }) => {
		const symbols = [Symbol('c'), Symbol('e'), Symbol('b'), Symbol('a'), Symbol('d')].sort(
			compare.symbol,
		);
		expect(symbols[0].toString()).toBe('Symbol(a)');
		expect(symbols[1].toString()).toBe('Symbol(b)');
		expect(symbols[2].toString()).toBe('Symbol(c)');
		expect(symbols[3].toString()).toBe('Symbol(d)');
		expect(symbols[4].toString()).toBe('Symbol(e)');
	});
	it('recursive inspect', ({ expect }) => {
		const data = [{ id: 0, name: 'B' }, { name: 'A' }, { id: 1, name: 'C' }];
		expect(data.sort(inspect)).toEqual([
			{ name: 'A' }, // name sorted first as it's the common denominator
			{ id: 1, name: 'C' }, // id takes over since it's defined first
			{ id: 0, name: 'B' },
		]);
	});
});
