import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as string from './index.js';

const suites = {
	'string/capitalize': suite('string/capitalize'),
	'string/catenate': suite('string/catenate'),
	'string/tsf': suite('string/tsf'),
};

suites['string/capitalize']('change one letter for one word', () => {
	assert.equal(string.capitalize('hello'), 'Hello');
});
suites['string/capitalize']('change two letter for two words', () => {
	assert.equal(string.capitalize('hello world'), 'Hello World');
});

suites['string/catenate']('joins paths base cases', () => {
	assert.equal(string.catenate(), '.');
	assert.equal(string.catenate(''), '.');
	assert.equal(string.catenate('/'), '/');
});
suites['string/catenate']('joins URL-like paths correctly', () => {
	assert.equal(string.catenate('/', 'root', ':id'), '/root/:id');
	assert.equal(string.catenate('relative', ':id'), 'relative/:id');
	assert.equal(string.catenate('/', '/', '/', '/foo/', '/', ':id'), '/foo/:id');
	assert.equal(string.catenate('', '', '', 'foo', '', ':id'), 'foo/:id');
});
suites['string/catenate']('joins file-like paths correctly', () => {
	assert.equal(string.catenate('/root', './user'), '/root/user');
	assert.equal(string.catenate('/root/usr/', '..'), '/root');
	assert.equal(string.catenate('/mnt/srv', './usr/../backup'), '/mnt/srv/backup');
	assert.equal(string.catenate('../usr', './backup'), '../usr/backup');
});

suites['string/tsf'].skip('throws on nested braces', () => {
	assert.throws(() => string.tsf('/{foo/{bar}}' as string));
	assert.throws(() => string.tsf('/{nested-{}-braces}' as string));
});
suites['string/tsf']('parses template without braces', () => {
	assert.equal(string.tsf('')({}), '');
	assert.equal(string.tsf('/')({}), '/');
	assert.equal(string.tsf('/foo')({}), '/foo');
});
suites['string/tsf']('parses template correctly', () => {
	const r1 = string.tsf('/{foo}/{bar}');

	assert.equal(
		r1({
			foo: 'hello',
			bar: 'world',
		}),
		'/hello/world',
	);
	assert.equal(
		r1({
			foo: (v) => v,
			bar: (v) => v,
		}),
		'/foo/bar',
	);
	assert.equal(
		r1({
			foo: (v) => [...v].reverse().join(''),
			bar: (v) => [...v].reverse().join(''),
		}),
		'/oof/rab',
	);
});
suites['string/tsf']('parses template with optional parameters', () => {
	const r = string.tsf('/{v}/api/users{?qs}');
	assert.equal(r({ v: 'v1' }), '/v1/api/users');
	assert.equal(r({ v: 'v1', '?qs': '?foo=bar' }), '/v1/api/users?foo=bar');
	assert.equal(r({ v: 'v1', '?qs': (v) => !v && `?${v}` }), '/v1/api/users');
});
suites['string/tsf'].skip('parses template with nested braces', () => {
	const r1 = string.tsf('/{foo/{bar}}' as string);
	assert.equal(r1({ 'foo/{bar}': (v) => v }), '/foo/{bar}');

	const r2 = string.tsf('/{nested-{}-braces}' as string);
	assert.equal(r2({ 'nested-{}-braces': (v) => v }), '/nested-{}-braces');
});

Object.values(suites).forEach((v) => v.run());
