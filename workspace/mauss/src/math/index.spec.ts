import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as math from './index.js';

const suites = {
	'average/': suite('math/average'),
	'modulo/': suite('math/modulo'),
	'permutation/': suite('math/permutation'),
	'permutation/+': suite('math/permutation+'),
};

suites['average/']('average base cases', () => {
	assert.equal(math.average([]), 0);
});
suites['average/']('average numbers', () => {
	assert.equal(math.average([1, 2, 3, 4, 5]), 3);
	assert.equal(math.average([10, 20, 30, 40, 50]), 30);
});

suites['modulo/']('modulo numbers', () => {
	assert.equal(math.modulo(10, 0), NaN);

	assert.equal(math.modulo(10, 3), 1);
	assert.equal(math.modulo(-10, 3), 2);
	assert.equal(math.modulo(10, -3), -2);
	assert.equal(math.modulo(-10, -3), -1);
	assert.equal(math.modulo(10, 5), 0);
	assert.equal(math.modulo(-10, 5), 0);
	assert.equal(math.modulo(10, -5), 0);
	assert.equal(math.modulo(-10, -5), 0);
	assert.equal(math.modulo(10, 1), 0);
	assert.equal(math.modulo(10, 10), 0);
});

suites['permutation/']('returns array with empty array for empty array', () => {
	assert.equal(math.permutation([]), [[]]);
});
suites['permutation/']('returns immediate wrapped input for one length array', () => {
	assert.equal(math.permutation(['a']), [['a']]);
});
suites['permutation/']('correctly permute 2 words and returns array of results', () => {
	assert.equal(math.permutation(['a', 'b']), [
		['a', 'b'],
		['b', 'a'],
	]);
});
suites['permutation/']('correctly permute 3 words and returns array of results', () => {
	assert.equal(math.permutation(['a', 'b', 'c']), [
		['a', 'b', 'c'],
		['a', 'c', 'b'],
		['b', 'a', 'c'],
		['b', 'c', 'a'],
		['c', 'a', 'b'],
		['c', 'b', 'a'],
	]);
});
suites['permutation/']('correctly permute 4 words and returns array of results', () => {
	assert.equal(math.permutation(['a', 'b', 'c', 'd']), [
		['a', 'b', 'c', 'd'],
		['a', 'b', 'd', 'c'],
		['a', 'c', 'b', 'd'],
		['a', 'c', 'd', 'b'],
		['a', 'd', 'b', 'c'],
		['a', 'd', 'c', 'b'],
		['b', 'a', 'c', 'd'],
		['b', 'a', 'd', 'c'],
		['b', 'c', 'a', 'd'],
		['b', 'c', 'd', 'a'],
		['b', 'd', 'a', 'c'],
		['b', 'd', 'c', 'a'],
		['c', 'a', 'b', 'd'],
		['c', 'a', 'd', 'b'],
		['c', 'b', 'a', 'd'],
		['c', 'b', 'd', 'a'],
		['c', 'd', 'a', 'b'],
		['c', 'd', 'b', 'a'],
		['d', 'a', 'b', 'c'],
		['d', 'a', 'c', 'b'],
		['d', 'b', 'a', 'c'],
		['d', 'b', 'c', 'a'],
		['d', 'c', 'a', 'b'],
		['d', 'c', 'b', 'a'],
	]);
});

const dashed = (i: string[]) => i.join('-');
suites['permutation/+']('returns array with empty string for empty array', () => {
	assert.equal(math.permutation([], dashed), ['']);
});
suites['permutation/+']('returns immediate input for one length array', () => {
	assert.equal(math.permutation(['a'], dashed), ['a']);
});
suites['permutation/+']('correctly permute and mutate 2 words', () => {
	assert.equal(math.permutation(['a', 'b'], dashed), ['a-b', 'b-a']);
});
suites['permutation/+']('correctly permute and mutate 3 words', () => {
	assert.equal(math.permutation(['a', 'b', 'c'], dashed), [
		'a-b-c',
		'a-c-b',
		'b-a-c',
		'b-c-a',
		'c-a-b',
		'c-b-a',
	]);
});
suites['permutation/+']('correctly permute and mutate 4 words', () => {
	assert.equal(math.permutation(['a', 'b', 'c', 'd'], dashed), [
		'a-b-c-d',
		'a-b-d-c',
		'a-c-b-d',
		'a-c-d-b',
		'a-d-b-c',
		'a-d-c-b',
		'b-a-c-d',
		'b-a-d-c',
		'b-c-a-d',
		'b-c-d-a',
		'b-d-a-c',
		'b-d-c-a',
		'c-a-b-d',
		'c-a-d-b',
		'c-b-a-d',
		'c-b-d-a',
		'c-d-a-b',
		'c-d-b-a',
		'd-a-b-c',
		'd-a-c-b',
		'd-b-a-c',
		'd-b-c-a',
		'd-c-a-b',
		'd-c-b-a',
	]);
});

Object.values(suites).forEach((v) => v.run());
