import { describe } from 'vitest';
import { cookies } from './index.js';

describe('parse', ({ concurrent: it }) => {
	it('should parse cookies', ({ expect }) => {
		const jar = cookies.parse('foo=bar;hi=mom;hello=world');
		expect(jar.get('foo')).toBe('bar');
		expect(jar.get('hi')).toBe('mom');
		expect(jar.get('hello')).toBe('world');
	});

	it('should handle nullish headers', ({ expect }) => {
		let header: null | undefined = null;
		const jar = cookies.parse(header);
		expect(jar.has('foo')).toBe(false);
		expect(jar.has('hi')).toBe(false);
		expect(jar.has('hello')).toBe(false);
		expect(jar.get('foo')).toBeUndefined();
		expect(jar.get('hi')).toBeUndefined();
		expect(jar.get('hello')).toBeUndefined();
	});

	it('should ignore spaces in cookies', ({ expect }) => {
		const jar = cookies.parse('foo   = bar;  hi=     mom');
		expect(jar.get('foo')).toBe('bar');
		expect(jar.get('hi')).toBe('mom');
	});

	it('should handle quoted values', ({ expect }) => {
		const jar = cookies.parse('foo="bar=123&hi=mom"');
		expect(jar.get('foo')).toBe('bar=123&hi=mom');
	});

	it('should handle escaped values', ({ expect }) => {
		const jar = cookies.parse('foo=%20%22%2c%2f%3b');
		expect(jar.get('foo')).toBe(' ",/;');
	});

	it('should ignore errors in parsing', ({ expect }) => {
		const jar = cookies.parse('foo=%1;bar=baz;huh;');
		expect(jar.get('foo')).toBe('%1');
		expect(jar.get('bar')).toBe('baz');
		expect(jar.has('huh')).toBe(false);
	});

	it('should ignore missing values', ({ expect }) => {
		const jar = cookies.parse('foo=;bar= ;huh');
		expect(jar.has('foo')).toBe(false);
		expect(jar.has('bar')).toBe(false);
		expect(jar.has('huh')).toBe(false);
	});
});

describe('create', ({ concurrent: it }) => {
	it('should generate Set-Cookie value', ({ expect }) => {
		const value = cookies.create()('foo', 'bar');
		expect(value).toMatch(/foo=bar; Expires=(.*); Path=\/; SameSite=Lax; HttpOnly/);
	});

	it('should set Secure attribute for SameSite=None', ({ expect }) => {
		const printer = cookies.create({ sameSite: 'None' });
		const value = printer('foo', 'bar');
		expect(value).toMatch(/foo=bar; Expires=(.*); Path=\/; SameSite=None; HttpOnly; Secure/);
	});
});

describe('remove', ({ concurrent: it }) => {
	it('should generate Set-Cookie value to remove cookie', ({ expect }) => {
		const value = cookies.remove('foo');
		expect(value).toMatch(/foo=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:01 GMT/);
	});
});

describe('bulk', ({ concurrent: it }) => {
	it('should generate Set-Cookie values for multiple cookies', ({ expect }) => {
		const data = { foo: 'bar', hi: 'mom', hello: 'world' };
		for (const value of cookies.bulk(data)) {
			expect(value).toMatch(/(.*)=(.*); Expires=(.*); Path=\/; SameSite=Lax; HttpOnly/);
		}
	});
});

describe('raw', ({ concurrent: it }) => {
	it('should parse raw cookie header', ({ expect }) => {
		const header = 'foo=bar;hi=mom;hello=world';
		expect(cookies.raw(header, 'foo')).toBe('bar');
		expect(cookies.raw(header, 'hi')).toBe('mom');
		expect(cookies.raw(header, 'hello')).toBe('world');
	});

	it('should handle nullish headers', ({ expect }) => {
		let header: null | undefined = null;
		expect(cookies.raw(header, 'foo')).toBeUndefined();
		expect(cookies.raw(header, 'hi')).toBeUndefined();
		expect(cookies.raw(header, 'hello')).toBeUndefined();
	});

	it('should ignore spaces in raw cookies', ({ expect }) => {
		const header = 'foo   = bar;  hi=  mom';
		expect(cookies.raw(header, 'foo')).toBe(' bar');
		expect(cookies.raw(header, 'hi')).toBe('  mom');
	});

	it('should handle quoted values in raw cookies', ({ expect }) => {
		const header = 'foo="bar=123&hi=mom"';
		expect(cookies.raw(header, 'foo')).toBe('"bar=123&hi=mom"');
	});

	it('should handle escaped values in raw cookies', ({ expect }) => {
		const header = 'foo=%20%22%2c%2f%3b';
		expect(cookies.raw(header, 'foo')).toBe('%20%22%2c%2f%3b');
	});

	it('should return empty values for missing keys', ({ expect }) => {
		const header = 'foo=;bar= ;huh';
		expect(cookies.raw(header, 'foo')).toBe('');
		expect(cookies.raw(header, 'bar')).toBe(' ');
		expect(cookies.raw(header, 'huh')).toBeUndefined();
	});
});
