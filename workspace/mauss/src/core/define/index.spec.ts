import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { define } from './index.js';

const suites = {
	'define/primitives': suite('define/primitives'),
	'define/schema': suite('define/schema'),
	'define/transform': suite('define/transform'),
};

suites['define/primitives']('string primitive', () => {
	assert.type(
		define(({ string }) => string()),
		'function',
	);
	assert.equal(define(({ string }) => string())(''), '');
	assert.equal(define(({ string }) => string())('hello'), 'hello');
	// @ts-expect-error
	assert.throws(define(({ string }) => string())(123));
	// @ts-expect-error
	assert.throws(define(({ string }) => string())(null));
	// @ts-expect-error
	assert.throws(define(({ string }) => string())(undefined));

	assert.equal(define(({ string }) => string((v) => v.toUpperCase()))('hello'), 'HELLO');
	assert.equal(define(({ string }) => string((v) => Number(v)))('123'), 123);
});

suites['define/schema']('object schema', () => {
	assert.type(
		define(({ string }) => ({ title: string() })),
		'function',
	);
	const schema = define(({ string }) => ({ title: string() }));
	assert.equal(schema({ title: 'Hello' }), { title: 'Hello' });

	// @ts-expect-error
	assert.throws(schema({ title: 123 }));
	// @ts-expect-error
	assert.throws(schema({}));
	// @ts-expect-error
	assert.throws(schema(null));
});
suites['define/schema']('nested object schema', () => {
	assert.type(
		define(({ string }) => ({ user: { name: string() } })),
		'function',
	);
	const schema = define(({ string }) => ({ user: { name: string() } }));
	assert.equal(schema({ user: { name: 'Alice' } }), { user: { name: 'Alice' } });

	// @ts-expect-error
	assert.throws(schema({ user: { name: 123 } }));
	// @ts-expect-error
	assert.throws(schema({}));
	// @ts-expect-error
	assert.throws(schema(null));
});
