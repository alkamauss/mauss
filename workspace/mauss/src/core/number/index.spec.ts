import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { modulo } from './index.js';

const suites = {
	'number/modulo': suite('number/modulo'),
};

suites['number/modulo']('modulo numbers', () => {
	assert.equal(modulo(10, 0), NaN);

	assert.equal(modulo(10, 3), 1);
	assert.equal(modulo(-10, 3), 2);
	assert.equal(modulo(10, -3), -2);
	assert.equal(modulo(-10, -3), -1);
	assert.equal(modulo(10, 5), 0);
	assert.equal(modulo(-10, 5), 0);
	assert.equal(modulo(10, -5), 0);
	assert.equal(modulo(-10, -5), 0);
	assert.equal(modulo(10, 1), 0);
	assert.equal(modulo(10, 10), 0);
});

Object.values(suites).forEach((v) => v.run());
