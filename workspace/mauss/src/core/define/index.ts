import { Rejection, type Issue } from './error.js';
import * as rules from './rules.js';

type Validator<T = unknown> = (input: unknown) => T;
interface Schema {
	[key: string]: Validator | Schema;
}
interface Options {
	input: unknown;
	path?: string[];
	schema: Schema;
	errors: Issue[];
}
function check({ path = [], errors, input, schema }: Options) {
	if (typeof input !== 'object' || input == null) {
		const type = typeof input === 'object' ? 'null' : typeof input;
		return void errors.push({
			expected: 'object',
			path: path.length ? path : ['<root>'],
			message: `[UnexpectedInput] Received "${type}"`,
		});
	}

	const result: Record<string, unknown> = {};
	for (const key in schema) {
		const current = [...path, key];
		const value = (input as any)[key];
		const validate = schema[key];
		try {
			if (typeof validate === 'function') {
				result[key] = validate(value);
			} else if (typeof validate === 'object') {
				result[key] = check({
					path: current,
					errors,
					input: value,
					schema: validate,
				});
			} else {
				errors.push({
					expected: 'definition',
					path: current,
					message: `[InvalidSchema] Received "${typeof validate}"`,
				});
			}
		} catch (e: any) {
			if (e && typeof e.expected === 'string' && typeof e.message === 'string') {
				errors.push({ expected: e.expected, path: current, message: e.message });
			} else throw e;
		}
	}
	return result;
}

type I<T> = T extends Validator<infer R> ? R : N<T>;
type N<T> = T extends Record<string, any> ? { [K in keyof T]: I<T[K]> } : never;
export function define<T>(builder: (r: typeof rules) => T) {
	const schema = builder(rules) as Validator | Schema;
	return (input: unknown): I<T> => {
		if (typeof schema === 'function') {
			return schema(input) as I<T>;
		}

		const errors: Options['errors'] = [];
		const result = check({ input, schema, errors });
		if (errors.length) throw new Rejection(errors);
		return result as I<T>;
	};
}
