import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { identical } from './identical.js';

const suites = {
	'compare/identical': suite('compare/identical'),
};

suites['compare/identical']('identical primitive checks', () => {
	// boolean
	assert.ok(identical(true, true));
	assert.ok(!identical(true, false));
	// string
	assert.ok(identical('a', 'a'));
	assert.ok(!identical('a', 'b'));
	// number
	assert.ok(identical(1, 1));
	assert.ok(!identical(1, 2));
	// bigint
	assert.ok(identical(0n, 0n));
	assert.ok(identical(1n, 1n));
	assert.ok(!identical(0n, 1n));
	assert.ok(!identical(0n, 0));
	assert.ok(!identical(0n, 1));
	assert.ok(!identical(1n, 0));
	assert.ok(!identical(1n, 1));
	// symbol
	assert.ok(identical(Symbol('abc'), Symbol('abc')));
	assert.ok(!identical(Symbol(0), Symbol('foo')));
	// null/undefined
	assert.ok(identical(null, null));
	assert.ok(identical(undefined, undefined));
	assert.ok(!identical(null, undefined));
	assert.ok(!identical(undefined, 0));
	assert.ok(!identical(undefined, ''));
	// function - true for any function comparison
	assert.ok(
		identical(
			() => {},
			() => {},
		),
	);
	assert.ok(
		identical(
			() => '',
			() => 0,
		),
	);
});
suites['compare/identical']('identical array checks', () => {
	assert.ok(identical([], []));
	assert.ok(identical(['', 1, !0], ['', 1, !0]));
	assert.ok(identical([{ x: [] }], [{ x: [] }]));
	assert.ok(!identical(['', 0, !0], ['', 1, !1]));
	assert.ok(!identical([{ x: [] }], [{ y: [] }]));
});
suites['compare/identical']('identical object checks', () => {
	assert.ok(identical({}, {}));
	assert.ok(identical({ a: '', b: 1, c: !0 }, { a: '', b: 1, c: !0 }));
	assert.ok(identical({ x: [{}], y: { a: 0 } }, { x: [{}], y: { a: 0 } }));
});
suites['compare/identical']('identical clone', async () => {
	const { clone } = await import('../object/index.js');
	const data = { a: [1, '', {}], o: { now: new Date() } };
	assert.ok(identical(data, clone(data)));
});

Object.values(suites).forEach((v) => v.run());
