import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as lambda from './index.js';

const suites = {
	'curry/': suite('lambda/curry'),
	'pipe/': suite('lambda/pipe'),
};

suites['curry/']('properly curry a function', () => {
	const sum = (a: number, b: number, c: number) => a + b + c;
	const curried = lambda.curry(sum);

	assert.type(curried, 'function');
	assert.type(curried(1), 'function');
	assert.type(curried(1)(1), 'function');
	assert.type(curried(1)(1)(1), 'number');
	assert.equal(curried(1)(1)(1), 3);
});

suites['pipe/']('properly apply functions in ltr order', () => {
	const cap = (v: string) => v.toUpperCase();
	const name = <T extends { name: string }>(v: T) => v.name;
	const split = (v: string) => v.split('');

	const pipeline = lambda.pipe(name, cap, split);
	assert.equal(pipeline({ name: 'mom' }), ['M', 'O', 'M']);
});

Object.values(suites).forEach((v) => v.run());
