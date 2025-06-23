import { describe } from 'vitest';
import { attempt } from './index.js';

describe('async', ({ concurrent: it }) => {
	it('attempt some work', async ({ expect }) => {
		expect(await attempt(async () => '')).toEqual({ data: '' });
		expect(
			await attempt(async () => {
				throw '';
			}),
		).toEqual({ error: '' });

		const answer = await attempt(async () => 42);
		expect(answer.data).toBe(42);

		let maybe: string | null | undefined;
		const work = await attempt(async () => maybe);
		expect(work.data || '2023-04-04').toBe('2023-04-04');
	});
});

describe('sync', ({ concurrent: it }) => {
	it('attempt some work', ({ expect }) => {
		expect(attempt.sync(() => '')).toEqual({ data: '' });
		expect(
			attempt.sync(() => {
				throw '';
			}),
		).toEqual({ error: '' });

		const answer = attempt.sync(() => 42);
		expect(answer.data).toBe(42);

		let maybe: string | null | undefined;
		const work = attempt.sync(() => maybe);
		expect(work.data || '2023-04-04').toBe('2023-04-04');
	});
});

describe('wrap', ({ concurrent: it }) => {
	it('wrap a function in an attempt', ({ expect }) => {
		const parse = attempt.wrap(JSON.parse);

		const a1 = parse('{"key": "value"}');
		expect(a1.data).toBeTypeOf('object');
		expect(a1.data?.key).toBe('value');
		expect(a1.error).toBeUndefined();

		const a2 = parse('invalid json');
		expect(a2.data).toBeUndefined();
		expect(a2.error).toBeTypeOf('object');
	});
});
