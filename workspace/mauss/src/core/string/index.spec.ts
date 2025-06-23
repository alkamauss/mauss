import { describe } from 'vitest';
import * as string from './index.js';

describe('capitalize', ({ concurrent: it }) => {
	it('should capitalize the first letter of a string', ({ expect }) => {
		expect(string.capitalize('hello')).toBe('Hello');
		expect(string.capitalize('hello world')).toBe('Hello World');
	});
});

describe('catenate', ({ concurrent: it }) => {
	it('should join paths correctly', ({ expect }) => {
		expect(string.catenate()).toBe('.');
		expect(string.catenate('')).toBe('.');
		expect(string.catenate('/')).toBe('/');

		expect(string.catenate('/', 'root', ':id')).toBe('/root/:id');
		expect(string.catenate('relative', ':id')).toBe('relative/:id');
		expect(string.catenate('/', '/', '/', '/foo/', '/', ':id')).toBe('/foo/:id');
		expect(string.catenate('', '', '', 'foo', '', ':id')).toBe('foo/:id');

		expect(string.catenate('/root', './user')).toBe('/root/user');
		expect(string.catenate('/root/usr/', '..')).toBe('/root');
		expect(string.catenate('/mnt/srv', './usr/../backup')).toBe('/mnt/srv/backup');
		expect(string.catenate('../usr', './backup')).toBe('../usr/backup');
	});
});

describe('tsf', ({ concurrent: it }) => {
	it.skip('should throw on invalid template', ({ expect }) => {
		expect(() => string.tsf('/{foo/{bar}}' as string)).toThrow();
		expect(() => string.tsf('/{nested-{}-braces}' as string)).toThrow();
	});

	it('should parse template without braces', ({ expect }) => {
		const r = string.tsf('');
		expect(r({})).toBe('');
		expect(r({ path: 'foo' })).toBe('');
	});

	it('should parse template correctly', ({ expect }) => {
		const r1 = string.tsf('/{foo}/{bar}');

		expect(r1({ foo: 'hello', bar: 'world' })).toBe('/hello/world');
		expect(r1({ foo: (v) => v, bar: (v) => v })).toBe('/foo/bar');
		expect(
			r1({ foo: (v) => [...v].reverse().join(''), bar: (v) => [...v].reverse().join('') }),
		).toBe('/oof/rab');
	});

	it('should parse template with optional parameters', ({ expect }) => {
		const r = string.tsf('/{v}/api/users{?qs}');
		expect(r({ v: 'v1' })).toBe('/v1/api/users');
		expect(r({ v: 'v1', '?qs': '?foo=bar' })).toBe('/v1/api/users?foo=bar');
		expect(r({ v: 'v1', '?qs': (v) => !v && `?${v}` })).toBe('/v1/api/users');
	});

	it.skip('should parse template with nested parameters', ({ expect }) => {
		const r1 = string.tsf('/{foo/{bar}}' as string);
		expect(r1({ 'foo/{bar}': (v) => v })).toBe('/foo/{bar}');

		const r2 = string.tsf('/{nested-{}-braces}' as string);
		expect(r2({ 'nested-{}-braces': (v) => v })).toBe('/nested-{}-braces');
	});
});
