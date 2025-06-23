import * as rules from './rules.js';

type Validator<T = unknown> = (input: unknown) => false | T;
interface Schema {
	[key: string]: Validator | Schema;
}
function check(input: Record<string, unknown>, schema: Schema) {
	for (const key in schema) {
		if (typeof schema[key] === 'object') {
			check(input[key] as any, schema[key]);
			continue;
		}
		const value = input[key];
		const result = schema[key](value);
		if (result === false) return false;
		input[key] = result;
	}
	return input;
}
export function define<T>(builder: (r: typeof rules) => T) {
	const schema = builder(rules) as Validator | Schema;
	type I<T> = T extends Validator<infer R> ? R : N<T>;
	type N<T> = T extends Record<string, any> ? { [K in keyof T]: I<T[K]> } : never;
	return (input: unknown): false | I<T> => {
		if (typeof schema === 'function') return schema(input) as I<T>;
		if (typeof input !== 'object' || input == null) return false;
		return check(input as any, schema) as I<T>;
	};
}

// attach the helpers as rules
define.rules = rules;
