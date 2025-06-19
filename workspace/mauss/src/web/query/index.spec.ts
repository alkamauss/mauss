import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { qsd, qse } from './index.js';

const suites = {
	'qs/decoder': suite('query/decoder'),
	'qs/encoder': suite('query/encoder'),
};

suites['qs/decoder']('decode empty query string', () => {
	assert.equal(qsd(''), {});
	assert.equal(qsd('?'), {});
});
suites['qs/decoder']('decode query string to object', () => {
	const pairs = [
		['?hi=mom&hello=world', { hi: ['mom'], hello: ['world'] }],
		['fam=mom&fam=dad&fam=sis', { fam: ['mom', 'dad', 'sis'] }],
		['fam&fam=dad&fam=mom', { fam: ['', 'dad', 'mom'] }],
		['mom&dad&sis', { mom: [''], dad: [''], sis: [''] }],
		['dynamic=value' as string, { dynamic: ['value'] }],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qsd(input), output);
	}
});
suites['qs/decoder']('decode query string with encoded values', () => {
	const pairs = [
		['?escape=spa%20zio!', { escape: ['spa zio!'] }],
		['?brackets=%5Bdynamic%5D', { brackets: ['[dynamic]'] }],
		['?%5Bbrackets%5D=boo', { '[brackets]': ['boo'] }],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qsd(input), output);
	}
});
suites['qs/decoder']('decode query string with boolean and numeric values', () => {
	const pairs = [
		['?bool=true', { bool: [true] }],
		['?bool=false', { bool: [false] }],
		['?num=123', { num: [123] }],
		['?num=0', { num: [0] }],
		['?num=NaN', { num: ['NaN'] }],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qsd(input), output);
	}
});
suites['qs/decoder']('decode edge cases', () => {
	assert.equal(qsd('?=empty'), { '': ['empty'] });
});

suites['qs/encoder']('encode object to query string', () => {
	let payload: string = 'dynamic';
	const pairs = [
		[{ hi: 'mom', hello: 'world' }, '?hi=mom&hello=world'],
		[{ payload, foo: 'bar' }, '?payload=dynamic&foo=bar'],
		[{ fam: ['mom', 'dad', 'sis'] }, '?fam=mom&fam=dad&fam=sis'],
		[{ escape: 'spa zio!' }, '?escape=spa+zio%21'],
		[{ brackets: '[dynamic]' }, '?brackets=%5Bdynamic%5D'],
		[{ '[brackets]': 'boo' }, '?%5Bbrackets%5D=boo'],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qse(input), output);
	}
});
suites['qs/encoder']('transform final string if it exists', () => {
	const bound = { q: '' };

	assert.equal(qse(bound), '');

	bound.q = 'hi';
	assert.equal(qse(bound), '?q=hi');
});

Object.values(suites).forEach((v) => v.run());
