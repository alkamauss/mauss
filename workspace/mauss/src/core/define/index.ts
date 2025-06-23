import { InputError } from './error.js';
import * as rules from './rules.js';

type Validator<T = unknown> = (input: unknown) => T;
interface Schema {
	[key: string]: Validator | Schema;
}
function check(input: Record<string, unknown>, schema: Schema) {
	if (typeof input !== 'object' || input == null) {
		throw new InputError('object', input);
	}
	for (const key in schema) {
		if (typeof schema[key] === 'object') {
			check(input[key] as any, schema[key]);
			continue;
		}
		input[key] = schema[key](input[key]);
	}
	return input;
}
export function define<T>(builder: (r: typeof rules) => T) {
	const schema = builder(rules) as Validator | Schema;
	type I<T> = T extends Validator<infer R> ? R : N<T>;
	type N<T> = T extends Record<string, any> ? { [K in keyof T]: I<T[K]> } : never;
	return (input: unknown): I<T> => {
		if (typeof schema === 'function') return schema(input) as I<T>;
		return check(input as any, schema) as I<T>;
	};
}
