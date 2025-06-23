import { describe } from 'vitest';
import { unique } from './filter.js';

describe('unique', () => {
	describe('simple', ({ concurrent: it }) => {
		it('make array items unique', ({ expect }) => {
			expect(unique([true, false, !0, !1])).toEqual([true, false]);
			expect(unique([1, 1, 2, 3, 2, 4, 5])).toEqual([1, 2, 3, 4, 5]);
			expect(unique(['a', 'a', 'b', 'c', 'b'])).toEqual(['a', 'b', 'c']);

			const months = ['jan', 'feb', 'mar'] as const;
			expect(unique(months)).toEqual(['jan', 'feb', 'mar']);
		});
	});

	describe('object', ({ concurrent: it }) => {
		it('make array of object unique', ({ expect }) => {
			expect(
				unique(
					[
						{ id: 'ab', name: 'A' },
						{ id: 'cd' },
						{ id: 'ef', name: 'B' },
						{ id: 'ab', name: 'C' },
						{ id: 'ef', name: 'D' },
					],
					'id',
				),
			).toEqual([{ id: 'ab', name: 'A' }, { id: 'cd' }, { id: 'ef', name: 'B' }]);

			expect(
				unique(
					[
						{ id: 'ab', name: { first: 'A' } },
						{ id: 'cd', name: { first: 'B' } },
						{ id: 'ef', name: { first: 'B' } },
						{ id: 'ab', name: { first: 'C' } },
						{ id: 'ef', name: { first: 'D' } },
						{ id: 'hi', name: { last: 'wa' } },
					],
					'name.first',
				),
			).toEqual([
				{ id: 'ab', name: { first: 'A' } },
				{ id: 'cd', name: { first: 'B' } },
				{ id: 'ab', name: { first: 'C' } },
				{ id: 'ef', name: { first: 'D' } },
			]);
		});
	});
});
