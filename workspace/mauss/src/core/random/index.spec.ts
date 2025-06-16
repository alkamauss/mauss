import { webcrypto as crypto } from 'node:crypto';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { random } from './index.js';

const suites = {
	'random/float': suite('random/float'),
	'random/int': suite('random/int'),
	'random/bool': suite('random/bool'),
	'random/array': suite('random/array'),
	'random/key': suite('random/key'),
	'random/val': suite('random/val'),
	'random/hex': suite('random/hex'),
	'random/ipv4': suite('random/ipv4'),
	'random/uuid': suite('random/uuid'),
};

suites['random/float']('generate random float', () => {
	const number = random.float();
	assert.type(number, 'number');
	assert.ok(number >= 0 && number < 1);
});
suites['random/float']('generate random float with min and max', () => {
	const number = random.float(1, 2);
	assert.type(number, 'number');
	assert.ok(number >= 1 && number < 2);
});

suites['random/int']('generate random integer', () => {
	const number = random.int();
	assert.type(number, 'number');
	assert.ok(number === 0 || number === 1);
});
suites['random/int']('generate random integer with min and max', () => {
	const number = random.int(2, 10);
	assert.type(number, 'number');
	assert.ok(number >= 2 && number <= 10);
});

suites['random/bool']('generate random bool', () => {
	assert.type(random.bool, 'boolean');
});

suites['random/array']('generate array with random values', () => {
	const array = random.array(5, 3);
	assert.type(array, 'object');
	assert.equal(array.length, 5);
});

suites['random/key']('get random key from object', () => {
	const key = random.key({ foo: 0, bar: 1 });
	assert.type(key, 'string');
	assert.ok(key === 'foo' || key === 'bar');
});

suites['random/val']('get random value from object', () => {
	const val = random.val({ foo: 0, bar: 1 });
	assert.type(val, 'number');
	assert.ok(val === 0 || val === 1);
});

suites['random/hex']('generate random hex color', () => {
	const hex = random.hex;
	assert.type(hex, 'string');
	assert.match(hex, /^#[0-9a-f]{6}$/);
});

suites['random/ipv4']('generate random ipv4 address', () => {
	assert.type(random.ipv4, 'string');
	assert.match(random.ipv4, /^(?!0\.0\.0\.0)(?!255\.255\.255\.255)(\d{1,3}\.){3}\d{1,3}$/);
});

suites['random/uuid']('generate random uuid', () => {
	const uuid = random.uuid();
	assert.equal(uuid.length, 36);
	assert.equal(uuid.split('-').length, 5);
	assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

Object.values(suites).forEach((v) => v.run());
