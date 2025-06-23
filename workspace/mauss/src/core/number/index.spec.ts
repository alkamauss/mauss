import { describe } from 'vitest';
import { modulo } from './index.js';

describe('modulo', ({ concurrent: it }) => {
	it('modulo numbers', ({ expect }) => {
		expect(modulo(10, 0)).toBeNaN();

		expect(modulo(10, 3) === 1).toBe(true);
		expect(modulo(-10, 3) === 2).toBe(true);
		expect(modulo(10, -3) === -2).toBe(true);
		expect(modulo(-10, -3) === -1).toBe(true);
		expect(modulo(10, 5) === 0).toBe(true);
		expect(modulo(-10, 5) === 0).toBe(true);
		expect(modulo(10, -5) === 0).toBe(true);
		expect(modulo(-10, -5) === 0).toBe(true);
		expect(modulo(10, 1) === 0).toBe(true);
		expect(modulo(10, 10) === 0).toBe(true);
	});
});
