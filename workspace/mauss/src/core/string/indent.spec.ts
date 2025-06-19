import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { indent } from './indent.js';

const suites = {
	'string/indent': suite('string/indent'),
};

suites['string/indent']('indent', () => {
	assert.equal(indent('').trim(), '');
	assert.equal(indent('  ').trim(), '');

	assert.equal(indent('  a').trim(), 'a');
	assert.equal(indent('  a\n  b').trim(), 'a\nb');

	const i = indent(`
		a
			b
		c
				d
	`);

	assert.equal(i.depth, 2);
	assert.equal(i.trim(), 'a\n\tb\nc\n\t\td');
});

Object.values(suites).forEach((v) => v.run());
