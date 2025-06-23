import { describe } from 'vitest';
import { random } from './index.js';

describe('float', ({ concurrent: it }) => {
	it('generate random float', ({ expect }) => {
		const number = random.float();
		expect(number).toBeTypeOf('number');
		expect(number >= 0 && number < 1).toBe(true);
	});
	it('generate random float with min and max', ({ expect }) => {
		const number = random.float(1, 2);
		expect(number).toBeTypeOf('number');
		expect(number >= 1 && number < 2).toBe(true);
	});
});

describe('int', ({ concurrent: it }) => {
	it('generate random integer', ({ expect }) => {
		const number = random.int();
		expect(number).toBeTypeOf('number');
		expect(number === 0 || number === 1).toBe(true);
	});
	it('generate random integer with min and max', ({ expect }) => {
		const number = random.int(2, 10);
		expect(number).toBeTypeOf('number');
		expect(number >= 2 && number <= 10).toBe(true);
	});
});

describe('bool', ({ concurrent: it }) => {
	it('generate random boolean', ({ expect }) => {
		const bool = random.bool;
		expect(bool).toBeTypeOf('boolean');
	});
});

describe('array', ({ concurrent: it }) => {
	it('generate array with random values', ({ expect }) => {
		const array = random.array(5, 3);
		expect(array).toBeTypeOf('object');
		expect(array.length).toBe(5);
	});
});

describe('key', ({ concurrent: it }) => {
	it('get random key from object', ({ expect }) => {
		const key = random.key({ foo: 0, bar: 1 });
		expect(key).toBeTypeOf('string');
		expect(key === 'foo' || key === 'bar').toBe(true);
	});
});

describe('val', ({ concurrent: it }) => {
	it('get random value from object', ({ expect }) => {
		const val = random.val({ foo: 0, bar: 1 });
		expect(val).toBeTypeOf('number');
		expect(val === 0 || val === 1).toBe(true);
	});
});

describe('hex', ({ concurrent: it }) => {
	it('generate random hex color', ({ expect }) => {
		const hex = random.hex;
		expect(hex).toBeTypeOf('string');
		expect(hex).toMatch(/^#[0-9a-f]{6}$/);
	});
});

describe('ipv4', ({ concurrent: it }) => {
	it('generate random ipv4 address', ({ expect }) => {
		expect(random.ipv4).toBeTypeOf('string');
		expect(random.ipv4).toMatch(/^(?!0\.0\.0\.0)(?!255\.255\.255\.255)(\d{1,3}\.){3}\d{1,3}$/);
	});
});

describe('uuid', ({ concurrent: it }) => {
	it('generate random uuid', ({ expect }) => {
		const uuid = random.uuid();
		expect(uuid.length).toBe(36);
		expect(uuid.split('-').length).toBe(5);
		expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	});
});
