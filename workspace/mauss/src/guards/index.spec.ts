import { describe } from 'vitest';
import * as guards from './index.js';

// checked based on https://developer.mozilla.org/en-US/docs/Glossary/Falsy
const data = [true, false, 'a', 'b', 0, 1, 2, '', null, undefined, NaN];
const numbers = [-2, -1, 0, 1, 2, 3];
const strings = ['a', 'A', 'b', 'B', 'c', 'C'];

describe('guards', ({ concurrent: it }) => {
	it('filters values that exists', ({ expect }) => {
		const filtered = data.filter(guards.exists);
		expect(filtered).toEqual([true, false, 'a', 'b', 0, 1, 2, NaN]);
	});

	it('filters values that are nullish', ({ expect }) => {
		const filtered = data.filter(guards.nullish);
		expect(filtered).toEqual([null, undefined]);
	});

	it('filters values that are truthy', ({ expect }) => {
		const filtered = data.filter(guards.truthy);
		expect(filtered).toEqual([true, 'a', 'b', 1, 2]);
	});

	it('filters numbers that are natural', ({ expect }) => {
		const filtered = numbers.filter(guards.natural);
		expect(filtered).toEqual([1, 2, 3]);
	});

	it('filters numbers that are whole', ({ expect }) => {
		const filtered = numbers.filter(guards.whole);
		expect(filtered).toEqual([0, 1, 2, 3]);
	});

	it('filters strings that are lowercase', ({ expect }) => {
		const filtered = strings.filter(guards.lowercase);
		expect(filtered).toEqual(['a', 'b', 'c']);
	});

	it('filters strings that are uppercase', ({ expect }) => {
		const filtered = strings.filter(guards.uppercase);
		expect(filtered).toEqual(['A', 'B', 'C']);
	});
});

describe('inverse', ({ concurrent: it }) => {
	it('filters values that does not exists', ({ expect }) => {
		const filtered = data.filter(guards.not(guards.exists));
		expect(filtered).toEqual(['', null, undefined]);
	});

	it('filters values that are not nullish', ({ expect }) => {
		const filtered = data.filter(guards.not(guards.nullish));
		expect(filtered).toEqual([true, false, 'a', 'b', 0, 1, 2, '', NaN]);
	});

	it('filters values that are falsy', ({ expect }) => {
		const filtered = data.filter(guards.not(guards.truthy));
		expect(filtered).toEqual([false, 0, '', null, undefined, NaN]);
	});

	it('filters numbers that are not natural', ({ expect }) => {
		const filtered = numbers.filter(guards.not(guards.natural));
		expect(filtered).toEqual([-2, -1, 0]);
	});

	it('filters numbers that are not whole', ({ expect }) => {
		const filtered = numbers.filter(guards.not(guards.whole));
		expect(filtered).toEqual([-2, -1]);
	});
});
