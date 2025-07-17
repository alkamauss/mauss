import { describe } from 'vitest';
import * as string from './index.js';
import { stylize } from './stylize.js';

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

describe('stylize', ({ concurrent: it }) => {
	it('to camelCase', ({ expect }) => {
		expect(stylize('myVarName', 'camel')).toBe('myVarName');
		expect(stylize('my_var_name', 'camel')).toBe('myVarName');
		expect(stylize('MyVarName', 'camel')).toBe('myVarName');
		expect(stylize('my-var-name', 'camel')).toBe('myVarName');
		expect(stylize('FOOBarBAZ', 'camel')).toBe('fooBarBaz');

		expect(stylize('my__var___name', 'camel')).toBe('myVarName');
		expect(stylize('foo  bar   baz', 'camel')).toBe('fooBarBaz');
	});

	it('to kebab-case', ({ expect }) => {
		expect(stylize('myVarName', 'kebab')).toBe('my-var-name');
		expect(stylize('my_var_name', 'kebab')).toBe('my-var-name');
		expect(stylize('MyVarName', 'kebab')).toBe('my-var-name');
		expect(stylize('my-var-name', 'kebab')).toBe('my-var-name');
		expect(stylize('FOOBarBAZ', 'kebab')).toBe('foo-bar-baz');

		expect(stylize('my__var___name', 'kebab')).toBe('my-var-name');
		expect(stylize('foo  bar   baz', 'kebab')).toBe('foo-bar-baz');
	});

	it('to PascalCase', ({ expect }) => {
		expect(stylize('myVarName', 'pascal')).toBe('MyVarName');
		expect(stylize('my_var_name', 'pascal')).toBe('MyVarName');
		expect(stylize('MyVarName', 'pascal')).toBe('MyVarName');
		expect(stylize('my-var-name', 'pascal')).toBe('MyVarName');
		expect(stylize('FOOBarBAZ', 'pascal')).toBe('FooBarBaz');

		expect(stylize('my__var___name', 'pascal')).toBe('MyVarName');
		expect(stylize('foo  bar   baz', 'pascal')).toBe('FooBarBaz');
	});

	it('to snake_case', ({ expect }) => {
		expect(stylize('myVarName', 'snake')).toBe('my_var_name');
		expect(stylize('my_var_name', 'snake')).toBe('my_var_name');
		expect(stylize('MyVarName', 'snake')).toBe('my_var_name');
		expect(stylize('my-var-name', 'snake')).toBe('my_var_name');
		expect(stylize('FOOBarBAZ', 'snake')).toBe('foo_bar_baz');

		expect(stylize('my__var___name', 'pascal')).toBe('MyVarName');
		expect(stylize('foo  bar   baz', 'pascal')).toBe('FooBarBaz');
	});

	it('to Title Case', ({ expect }) => {
		expect(stylize('myVarName', 'title')).toBe('My Var Name');
		expect(stylize('my_var_name', 'title')).toBe('My Var Name');
		expect(stylize('MyVarName', 'title')).toBe('My Var Name');
		expect(stylize('my-var-name', 'title')).toBe('My Var Name');
		expect(stylize('FOOBarBAZ', 'title')).toBe('Foo Bar Baz');

		expect(stylize('my__var___name', 'title')).toBe('My Var Name');
		expect(stylize('foo  bar   baz', 'title')).toBe('Foo Bar Baz');
	});
});
