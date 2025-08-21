import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { read } from './index.js';

test('construct simple index', () => {
	const index = read(
		`
title: Simple Index
tags: [x, y, z]
		`.trim(),
	);

	assert.equal(index, {
		title: 'Simple Index',
		tags: ['x', 'y', 'z'],
	});
});
test('construct marqua rules', () => {
	const index = read(
		`
title: Marqua Rules
date:published: 2023-02-01
a:b:x: 0
a:b:y: 1
a:b:z: 2
		`.trim(),
	);

	assert.equal(index, {
		title: 'Marqua Rules',
		date: { published: '2023-02-01' },
		a: { b: { x: '0', y: '1', z: '2' } },
	});
});
test('convert boolean values', () => {
	const index = read(
		`
title: Casting Boolean
draft: false
hex: ["x", true, 0, false]
		`.trim(),
	);

	assert.equal(index, {
		title: 'Casting Boolean',
		draft: false,
		hex: ['x', true, '0', false],
	});
});
test('construct literal block', () => {
	const index = read(
		`
title: Literal Block
data: |
	Hello World
	Lorem Ipsum
		`.trim(),
	);

	assert.equal(index, {
		title: 'Literal Block',
		data: 'Hello World\nLorem Ipsum',
	});
});
test('construct sequences', () => {
	const index = read(
		`
title: List Sequence
hex:
	- 'x'
	- true
	- 0
		`.trim(),
	);

	assert.equal(index, {
		title: 'List Sequence',
		hex: ['x', true, '0'],
	});
});
test('construct indents', () => {
	const index = read(
		`
title: Indented Objects
jobs:
	test:
		with: node
	sync:
		with: pnpm
		`.trim(),
	);

	assert.equal(index, {
		title: 'Indented Objects',
		jobs: {
			test: { with: 'node' },
			sync: { with: 'pnpm' },
		},
	});
});
test('construct indented sequences', () => {
	const index = read(
		`
title: Indented Objects and Arrays
jobs:
	test:
		- with: node
			os: windows
	sync:
		- with: pnpm
			os: linux
			env:
				TOKEN: 123
		`.trim(),
	);

	assert.equal(index, {
		title: 'Indented Objects and Arrays',
		jobs: {
			test: [{ with: 'node', os: 'windows' }],
			sync: [{ with: 'pnpm', os: 'linux', env: { TOKEN: '123' } }],
		},
	});
});
test('handle edge cases', () => {
	const index = read(
		`
title: Edge Cases
name: "Hello: World"
link: https://github.com
		`.trim(),
	);

	assert.equal(index, {
		title: 'Edge Cases',
		name: 'Hello: World',
		link: 'https://github.com',
	});
});

test.run();
