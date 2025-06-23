import { describe } from 'vitest';
import { indent } from './indent.js';

describe('indent', ({ concurrent: it }) => {
	it('should indent strings correctly', ({ expect }) => {
		expect(indent('').trim()).toBe('');
		expect(indent('  ').trim()).toBe('');

		expect(indent('  a').trim()).toBe('a');
		expect(indent('  a\n  b').trim()).toBe('a\nb');

		const i = indent(`
		a
			b
		c
				d
		`);

		expect(i.depth).toBe(2);
		expect(i.trim()).toBe('a\n\tb\nc\n\t\td');
	});
});
