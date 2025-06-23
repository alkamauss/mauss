import { describe } from 'vitest';
import { qsd, qse } from './index.js';

describe('decode', ({ concurrent: it }) => {
	it('should decode empty strings', ({ expect }) => {
		expect(qsd('')).toEqual({});
		expect(qsd('?')).toEqual({});
	});

	it('should decode query strings to objects', ({ expect }) => {
		expect(qsd('?hi=mom&hello=world')).toEqual({ hi: ['mom'], hello: ['world'] });
		expect(qsd('fam=mom&fam=dad&fam=sis')).toEqual({ fam: ['mom', 'dad', 'sis'] });
		expect(qsd('fam&fam=dad&fam=mom')).toEqual({ fam: ['', 'dad', 'mom'] });
		expect(qsd('mom&dad&sis')).toEqual({ mom: [''], dad: [''], sis: [''] });
		expect(qsd('dynamic=value' as string)).toEqual({ dynamic: ['value'] });
	});

	it('should decode query strings with encoded values', ({ expect }) => {
		expect(qsd('?escape=spa%20zio!')).toEqual({ escape: ['spa zio!'] });
		expect(qsd('?brackets=%5Bdynamic%5D')).toEqual({ brackets: ['[dynamic]'] });
		expect(qsd('?%5Bbrackets%5D=boo')).toEqual({ '[brackets]': ['boo'] });
	});

	it('should decode query strings with boolean and numeric values', ({ expect }) => {
		expect(qsd('?bool=true')).toEqual({ bool: [true] });
		expect(qsd('?bool=false')).toEqual({ bool: [false] });
		expect(qsd('?num=123')).toEqual({ num: [123] });
		expect(qsd('?num=0')).toEqual({ num: [0] });
		expect(qsd('?num=NaN')).toEqual({ num: ['NaN'] });
	});

	it('should decode edge cases', ({ expect }) => {
		expect(qsd('?=empty')).toEqual({ '': ['empty'] });
	});
});

describe('encode', ({ concurrent: it }) => {
	it('should encode empty objects', ({ expect }) => {
		expect(qse({})).toBe('');
		expect(qse({ q: '' })).toBe('');
	});

	it('should encode objects to query strings', ({ expect }) => {
		expect(qse({ hi: 'mom', hello: 'world' })).toBe('?hi=mom&hello=world');
		expect(qse({ fam: ['mom', 'dad', 'sis'] })).toBe('?fam=mom&fam=dad&fam=sis');
		expect(qse({ payload: 'dynamic', foo: 'bar' })).toBe('?payload=dynamic&foo=bar');
		expect(qse({ escape: 'spa zio!' })).toBe('?escape=spa+zio%21');
		expect(qse({ brackets: '[dynamic]' })).toBe('?brackets=%5Bdynamic%5D');
		expect(qse({ '[brackets]': 'boo' })).toBe('?%5Bbrackets%5D=boo');
	});

	it('should transform final string if it exists', ({ expect }) => {
		const bound = { q: '' };

		expect(qse(bound)).toBe('');

		bound.q = 'hi';
		expect(qse(bound)).toBe('?q=hi');
	});
});
