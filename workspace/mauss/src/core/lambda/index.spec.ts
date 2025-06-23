import { describe } from 'vitest';
import * as lambda from './index.js';

describe('curry', ({ concurrent: it }) => {
	it('curries a function', ({ expect }) => {
		const sum = (a: number, b: number, c: number) => a + b + c;
		const curried = lambda.curry(sum);

		expect(curried).toBeTypeOf('function');
		expect(curried(1)).toBeTypeOf('function');
		expect(curried(1)(1)).toBeTypeOf('function');
		expect(curried(1)(1)(1)).toBeTypeOf('number');
		expect(curried(1)(1)(1)).toBe(3);
	});
});

describe('pipe', ({ concurrent: it }) => {
	it('pipes functions together', ({ expect }) => {
		const cap = (v: string) => v.toUpperCase();
		const name = <T extends { name: string }>(v: T) => v.name;
		const split = (v: string) => v.split('');

		const pipeline = lambda.pipe(name, cap, split);
		expect(pipeline).toBeTypeOf('function');
		expect(pipeline({ name: 'mom' })).toEqual(['M', 'O', 'M']);
	});
});
