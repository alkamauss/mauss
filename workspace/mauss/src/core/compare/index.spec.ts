import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { compare, inspect } from './index.js';
import { arrange, drill } from './customized.js';

const suites = {
	'compare/undefined': suite('compare/undefined'),
	'compare/boolean': suite('compare/boolean'),
	'compare/number': suite('compare/number'),
	'compare/bigint': suite('compare/bigint'),
	'compare/symbol': suite('compare/symbol'),
	'compare/string': suite('compare/string'),
	'compare/object': suite('compare/object'),

	'compare/inspect': suite('compare/inspect'),
	'compare/wildcard': suite('compare/wildcard'),

	'customized/arrange': suite('compare/arrange'),
	'customized/arrange.drill': suite('compare/arrange.drill'),
} as const;

suites['compare/undefined']('sort undefined values with null values above', () => {
	assert.equal(
		[undefined, 3, 0, null, 1, -1, undefined, -2, undefined, null].sort(compare.undefined),
		[3, 0, 1, -1, -2, null, null, undefined, undefined, undefined],
	);
});

suites['compare/boolean']('sort boolean values with true above', () => {
	assert.equal(
		[true, false, true, false, true, false, true, false, true, false].sort(compare.boolean),
		[true, true, true, true, true, false, false, false, false, false],
	);
});

suites['compare/number']('sort number in descending order', () => {
	assert.equal(
		[5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number),
		[9, 6, 5, 4, 3, 2, 1, 0, -1, -2],
	);
});

suites['compare/bigint']('sort bigint in ascending order', () => {
	assert.equal([5n, 3n, 10n, 0n, 1n, -2n].sort(compare.bigint), [-2n, 0n, 1n, 3n, 5n, 10n]);
});

suites['compare/string']('sort string in alphabetical order', () => {
	assert.equal(
		['k', 'h', 'g', 'f', 'e', 'l', 'd', 'm', 'c', 'b', 'j', 'i', 'a'].sort(compare.string),
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
	);
	assert.equal(
		['K', 'H', 'G', 'F', 'E', 'L', 'D', 'M', 'C', 'B', 'J', 'I', 'A'].sort(compare.string),
		['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
	);
});

suites['customized/arrange']('customized compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const list = ['March', 'June', 'May', 'April', 'January', 'June', 'February'];
	const result = ['January', 'February', 'March', 'April', 'May', 'June', 'June'];
	assert.equal(list.sort(arrange(months)), result);
});

suites['customized/arrange.drill']('nested keyed compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const posts = [
		{ date: { pub: { month: 'March' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'May' } } },
		{ date: { pub: { month: 'April' } } },
		{ date: { pub: { month: 'January' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'February' } } },
	];
	assert.equal(posts.sort(drill('date.pub.month', arrange(months))), [
		{ date: { pub: { month: 'January' } } },
		{ date: { pub: { month: 'February' } } },
		{ date: { pub: { month: 'March' } } },
		{ date: { pub: { month: 'April' } } },
		{ date: { pub: { month: 'May' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'June' } } },
	]);
});

suites['compare/inspect']('inspect', () => {
	assert.type(inspect, 'function');

	const data = [{ id: 0, name: 'B' }, { name: 'A' }, { id: 1, name: 'C' }];
	assert.equal(data.sort(inspect), [
		{ name: 'A' }, // name sorted first as it's the common denominator
		{ id: 1, name: 'C' }, // id takes over since it's defined first
		{ id: 0, name: 'B' },
	]);
});

Object.values(suites).forEach((v) => v.run());
