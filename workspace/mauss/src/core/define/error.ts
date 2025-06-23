import type * as rules from './rules.js';

export class SchemaError extends Error {
	constructor(message: string) {
		super(`Schema Error: ${message}`);
		this.name = 'SchemaError';
	}
}

export class InputError extends Error {
	constructor(rule: 'object' | keyof typeof rules, input: unknown) {
		super(`Unexpected input for ${rule}: Received "${typeof input}" (${JSON.stringify(input)})`);
		this.name = 'InputError';
	}
}

export class InvalidInput extends Error {
	constructor(rule: keyof typeof rules, message: string) {
		super(`Invalid input for ${rule}: ${message}`);
		this.name = 'InvalidInput';
	}
}
