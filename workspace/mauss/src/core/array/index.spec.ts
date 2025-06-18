import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { average } from './reduce.js';

const suites = {
	'average/': suite('math/average'),
};

suites['average/']('average base cases', () => {
	assert.equal(average([]), 0);
});
suites['average/']('average numbers', () => {
	assert.equal(average([1, 2, 3, 4, 5]), 3);
	assert.equal(average([10, 20, 30, 40, 50]), 30);
});

Object.values(suites).forEach((v) => v.run());
