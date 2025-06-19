import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { average, sides } from './reduce.js';

const suites = {
	'array/average': suite('array/average'),
	'array/sides': suite('array/sides'),
};

suites['array/average']('average base cases', () => {
	assert.equal(average([]), 0);
});
suites['array/average']('average numbers', () => {
	assert.equal(average([1, 2, 3, 4, 5]), 3);
	assert.equal(average([10, 20, 30, 40, 50]), 30);
});

suites['array/sides']('first and last element', () => {
	assert.equal(sides(''), { head: undefined, last: undefined });
	assert.equal(sides([]), { head: undefined, last: undefined });

	assert.equal(sides('abz'), { head: 'a', last: 'z' });
	assert.equal(sides([{ a: 0 }, { z: 'i' }]), { head: { a: 0 }, last: { z: 'i' } });
});

Object.values(suites).forEach((v) => v.run());
