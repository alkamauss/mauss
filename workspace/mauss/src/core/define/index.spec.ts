import { describe } from 'vitest';
import { define } from './index.js';

describe('primitives', ({ concurrent: it }) => {
	it('string', ({ expect }) => {
		const schema = define(({ string }) => string());

		expect(schema).toBeTypeOf('function');
		expect(schema('')).toBe('');
		expect(schema('hello')).toBe('hello');

		expect(() => schema(123)).toThrow();
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
	});

	it('number', ({ expect }) => {
		const schema = define(({ number }) => number());

		expect(schema).toBeTypeOf('function');
		expect(schema(123)).toBe(123);
		expect(schema(0)).toBe(0);
		expect(schema(-456)).toBe(-456);

		expect(schema('0')).toBe(0);
		expect(schema('123')).toBe(123);
		expect(schema(' -456 ')).toBe(-456);
		expect(schema(' 0.00 ')).toBe(0);
		expect(schema(' 123.45 ')).toBe(123.45);

		expect(schema(true)).toBe(1);
		expect(schema(false)).toBe(0);

		expect(schema(9007199254740991n)).toBe(9007199254740991);
		expect(schema(-9007199254740991n)).toBe(-9007199254740991);

		expect(() => schema('invalid')).toThrow();
		expect(() => schema(NaN)).toThrow();
		expect(() => schema(null)).toThrow();
		expect(() => schema(undefined)).toThrow();
		expect(() => schema(9007199254740992n)).toThrow();
		expect(() => schema(-9007199254740992n)).toThrow();
	});

	it('date', ({ expect }) => {
		const schema = define(({ date }) => date());

		expect(schema).toBeTypeOf('function');
		expect(schema(new Date('2025-06-25'))).toEqual(new Date('2025-06-25'));
		expect(schema('2025-06-25')).toEqual(new Date('2025-06-25'));

		expect(() => schema('invalid')).toThrow();
	});
});

describe('schema', ({ concurrent: it }) => {
	it('object schema', ({ expect }) => {
		const schema = define(({ string }) => ({ title: string() }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ title: 'Hello' })).toEqual({ title: 'Hello' });

		expect(() => schema(null)).toThrow();
		expect(() => schema({})).toThrow();
		expect(() => schema({ title: 123 })).toThrow();
	});

	it('nested object schema', ({ expect }) => {
		const schema = define(({ string }) => ({ user: { name: string() } }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ user: { name: 'Alice' } })).toEqual({ user: { name: 'Alice' } });

		expect(() => schema({ user: { name: 123 } })).toThrow();
	});

	it('array schema', ({ expect }) => {
		const schema = define(({ array, string }) => ({ tags: array(string()) }));

		expect(schema).toBeTypeOf('function');
		expect(schema({ tags: ['tag1', 'tag2'] })).toEqual({ tags: ['tag1', 'tag2'] });

		expect(() => schema({ tags: ['tag1', 123] })).toThrow();
	});

	it('object in array schema', ({ expect }) => {
		const schema = define(({ optional, array, string }) => ({
			soundtrack: array({
				name: string(),
				artist: optional(string(), ''),
				youtube: optional(string()),
			}),
		}));

		expect(schema).toBeTypeOf('function');
		expect(schema({ soundtrack: [] })).toEqual({ soundtrack: [] });
		expect(schema({ soundtrack: [{ name: 'song', artist: 'artist' }] })).toEqual({
			soundtrack: [{ name: 'song', artist: 'artist', youtube: undefined }],
		});

		expect(() => schema({})).toThrow();
		expect(() => schema({ soundtrack: [{ name: 123 }] })).toThrow();
	});

	it('optional field', ({ expect }) => {
		const schema = define(({ optional, string }) => ({ title: optional(string()) }));

		expect(schema).toBeTypeOf('function');
		expect(schema({})).toEqual({});
		expect(schema({ title: 'Hello' })).toEqual({ title: 'Hello' });

		expect(() => schema({ title: 123 })).toThrow();
	});

	it('default value', ({ expect }) => {
		const schema = define(({ optional, string }) => ({
			title: optional(string(), 'default'),
		}));

		expect(schema).toBeTypeOf('function');
		expect(schema({})).toEqual({ title: 'default' });
		expect(schema({ title: 'custom' })).toEqual({ title: 'custom' });

		expect(() => schema({ title: 123 })).toThrow();
	});

	it('optional object', ({ expect }) => {
		const schema = define(({ optional, string }) => ({
			soundtrack: optional({
				name: string(),
				artist: optional(string(), ''),
				youtube: optional(string()),
			}),
		}));

		expect(schema).toBeTypeOf('function');
		expect(schema({})).toEqual({ soundtrack: undefined });
		expect(schema({ soundtrack: { name: 'song', artist: 'artist' } })).toEqual({
			soundtrack: { name: 'song', artist: 'artist', youtube: undefined },
		});

		expect(() => schema({ soundtrack: { name: 123 } })).toThrow();
	});

	it('optional object in array', ({ expect }) => {
		const schema = define(({ optional, array, string }) => ({
			soundtrack: optional(array({ name: string() })),
		}));

		expect(schema).toBeTypeOf('function');
		expect(schema({})).toEqual({ soundtrack: undefined });
		expect(schema({ soundtrack: [] })).toEqual({ soundtrack: [] });
		expect(schema({ soundtrack: [{ name: 'song' }] })).toEqual({
			soundtrack: [{ name: 'song' }],
		});

		expect(() => schema({ soundtrack: {} })).toThrow();
	});
});

describe('errors', ({ concurrent: it }) => {
	it('error types', ({ expect }) => {
		expect(() => define(({ literal }) => literal())('')).toThrowError(
			expect.objectContaining({ message: expect.stringContaining('[InvalidSchema]') }),
		);

		expect(() => define(({ string }) => string())(123)).toThrowError(
			expect.objectContaining({ message: expect.stringContaining('[UnexpectedInput]') }),
		);

		expect(() => define(({ number }) => number())(NaN)).toThrowError(
			expect.objectContaining({ message: expect.stringContaining('[UnexpectedInput]') }),
		);
	});

	it('input error', ({ expect }) => {
		const schema = define(({ string }) => string());

		expect(() => schema(123)).toThrow('[UnexpectedInput] Received "number"');
		expect(() => schema(null)).toThrow('[UnexpectedInput] Received "object"');
		expect(() => schema(undefined)).toThrow('[UnexpectedInput] Received "undefined"');
	});

	it('wrap safely', async ({ expect }) => {
		const { attempt } = await import('../attempt/index.js');
		const schema = attempt.wrap(define(({ string }) => string()));

		expect(schema).toBeTypeOf('function');
		expect(schema('test')).toEqual(expect.objectContaining({ data: 'test' }));
		expect(schema(123)).toEqual(
			expect.objectContaining({
				error: expect.objectContaining({
					message: '[UnexpectedInput] Received "number"',
				}),
			}),
		);
	});
});
