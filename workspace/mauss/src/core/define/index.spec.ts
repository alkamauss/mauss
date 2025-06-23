import { describe } from 'vitest';
import { define } from './index.js';

describe('primitives', ({ concurrent: it }) => {
	it('string', ({ expect }) => {
		const schema = define(({ string }) => string());

		expect(schema).toBeTypeOf('function');
		expect(schema('')).toBe('');
		expect(schema('hello')).toBe('hello');

		expect(() => schema(123)).toThrow();
		expect(() => schema(null)).toThrow();
		expect(() => schema(undefined)).toThrow();

		expect(define(({ string }) => string((v) => v.toUpperCase()))('hello')).toBe('HELLO');
		expect(define(({ string }) => string((v) => Number(v)))('123')).toBe(123);
	});

	it('transforms', ({ expect }) => {
		const schema = define(({ string }) => string((v) => Number(v)));

		expect(schema).toBeTypeOf('function');
		expect(schema('123')).toBe(123);
		expect(schema('456')).toBe(456);
	});

	it('literal', ({ expect }) => {
		const schema = define(({ literal }) => ({ status: literal('active') }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ status: 'active' })).toEqual({ status: 'active' });

		expect(() => schema({ status: 'inactive' })).toThrow();
		expect(() => schema(null)).toThrow();
	});
});

describe('schema', ({ concurrent: it }) => {
	it('object schema', ({ expect }) => {
		const schema = define(({ string }) => ({ title: string() }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ title: 'Hello' })).toEqual({ title: 'Hello' });

		expect(() => schema({ title: 123 })).toThrow();
		expect(() => schema({})).toThrow();
		expect(() => schema(null)).toThrow();
	});

	it('nested object schema', ({ expect }) => {
		const schema = define(({ string }) => ({ user: { name: string() } }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ user: { name: 'Alice' } })).toEqual({ user: { name: 'Alice' } });

		expect(() => schema({ user: { name: 123 } })).toThrow();
		expect(() => schema({})).toThrow();
		expect(() => schema(null)).toThrow();
	});

	it('array schema', ({ expect }) => {
		const schema = define(({ array, string }) => ({ tags: array(string()) }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ tags: ['tag1', 'tag2'] })).toEqual({ tags: ['tag1', 'tag2'] });

		expect(() => schema({ tags: ['tag1', 123] })).toThrow();
		expect(() => schema({})).toThrow();
		expect(() => schema(null)).toThrow();
	});

	it('optional field', ({ expect }) => {
		const schema = define(({ optional, string }) => ({ title: optional(string()) }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ title: 'Hello' })).toEqual({ title: 'Hello' });
		expect(schema({})).toEqual({});

		expect(() => schema({ title: 123 })).toThrow();
		expect(() => schema(null)).toThrow();
	});

	it('default value', ({ expect }) => {
		const schema = define(({ optional, string }) => ({
			title: optional(string(), 'Default Title'),
		}));

		expect(schema).toBeTypeOf('function');
		expect(schema({})).toEqual({ title: 'Default Title' });
		expect(schema({ title: 'Custom Title' })).toEqual({ title: 'Custom Title' });

		expect(() => schema({ title: 123 })).toThrow();
		expect(() => schema(null)).toThrow();
	});
});
