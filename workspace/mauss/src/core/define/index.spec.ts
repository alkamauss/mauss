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
	assert.equal(define(({ string }) => string())(123), false);
	assert.equal(define(({ string }) => string())(null), false);
	assert.equal(define(({ string }) => string())(undefined), false);

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
	assert.equal(schema({ title: 123 }), false);
	assert.equal(schema({}), false);
	assert.equal(schema(null), false);
});
suites['define/schema']('nested object schema', () => {
	assert.type(
		define(({ string }) => ({ user: { name: string() } })),
		'function',
	);
	const schema = define(({ string }) => ({ user: { name: string() } }));
	assert.equal(schema({ user: { name: 'Alice' } }), { user: { name: 'Alice' } });
	assert.equal(schema({ user: { name: 123 } }), false);
	assert.equal(schema({}), false);
	assert.equal(schema(null), false);
});
