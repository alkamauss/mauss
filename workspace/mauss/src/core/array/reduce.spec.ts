import { describe } from 'vitest';
import { average, sides } from './reduce.js';

describe('average', ({ concurrent: it }) => {
	it('base case', ({ expect }) => {
		expect(average([]) === 0).toBe(true);
	});

	it('numbers', ({ expect }) => {
		expect(average([1, 2, 3, 4, 5]) === 3).toBe(true);
		expect(average([10, 20, 30, 40, 50]) === 30).toBe(true);
	});
});

describe('sides', ({ concurrent: it }) => {
	it('first and last element', ({ expect }) => {
		expect(sides('')).toEqual({ head: undefined, last: undefined });
		expect(sides([])).toEqual({ head: undefined, last: undefined });
		expect(sides('abz')).toEqual({ head: 'a', last: 'z' });
		expect(sides([{ a: 0 }, { z: 'i' }])).toEqual({ head: { a: 0 }, last: { z: 'i' } });
	});
});
