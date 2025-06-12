import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { attempt } from './index.js';

const suites = {
	'attempt/async': suite('attempt/async'),
	'attempt/sync': suite('attempt/sync'),
	'attempt/wrap': suite('attempt/wrap'),
};

suites['attempt/async']('properly attempt some work asynchronously', async () => {
	assert.equal(await attempt(async () => ''), { data: '' });
	assert.equal(
		await attempt(async () => {
			throw '';
		}),
		{ error: '' },
	);

	const answer = await attempt(async () => 42);
	assert.equal(answer.data, 42);

	let maybe: string | null | undefined;
	const work = await attempt(async () => maybe);
	assert.equal(work.data || '2023-04-04', '2023-04-04');
});

suites['attempt/sync']('properly attempt some work synchronously', () => {
	assert.equal(
		attempt.sync(() => ''),
		{ data: '' },
	);
	assert.equal(
		attempt.sync(() => {
			throw '';
		}),
		{ error: '' },
	);

	const answer = attempt.sync(() => 42);
	assert.equal(answer.data, 42);

	let maybe: string | null | undefined;
	const work = attempt.sync(() => maybe);
	assert.equal(work.data || '2023-04-04', '2023-04-04');
});

suites['attempt/wrap']('properly wrap a function in an attempt', () => {
	const parse = attempt.wrap(JSON.parse);
	const a1 = parse('{"key": "value"}');
	assert.type(a1.data, 'object');
	assert.equal(a1.data?.key, 'value');
	assert.type(a1.error, 'undefined');

	const a2 = parse('invalid json');
	assert.type(a2.data, 'undefined');
	assert.type(a2.error, 'object');
});

Object.values(suites).forEach((v) => v.run());
