import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { qsd, qse } from './index.js';

const suites = {
	'q/decoder': suite('query/decoder'),
	'q/encoder': suite('query/encoder'),
};

suites['q/decoder']('decode query string to object', () => {
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

suites['q/encoder']('encode object to query string', () => {
	let payload: string = 'dynamic';
	const pairs = [
		[{ hi: 'mom', hello: 'world' }, '?hi=mom&hello=world'],
		[{ payload, foo: 'bar' }, '?payload=dynamic&foo=bar'],
		[{ fam: ['mom', 'dad', 'sis'] }, '?fam=mom&fam=dad&fam=sis'],
		[{ escape: 'spa zio!' }, '?escape=spa%20zio!'],
		[{ brackets: '[dynamic]' }, '?brackets=%5Bdynamic%5D'],
		[{ '[brackets]': 'boo' }, '?%5Bbrackets%5D=boo'],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qse(input), output);
	}
});
suites['q/encoder']('transform final string if it exists', () => {
	const bound = { q: '' };

	assert.equal(qse(bound), '');

	bound.q = 'hi';
	assert.equal(qse(bound), '?q=hi');
});

Object.values(suites).forEach((v) => v.run());
