import { Rejection, type Issue } from './error.js';

interface Rules {
	optional: typeof optional;

	boolean: typeof boolean;
	number: typeof number;
	string: typeof string;

	literal: typeof literal;
	date: typeof date;

	array: typeof array;
	record: typeof record;
}

type I<T> = T extends Validator<infer R> ? R : N<T>;
type N<T> = T extends Record<string, any> ? { [K in keyof T]: I<T[K]> } : never;
export function define<T>(builder: (r: Rules) => T) {
	const schema: Validator | Schema = builder({
		optional,
		boolean,
		number,
		string,
		literal,
		date,
		array,
		record,
	}) as any;
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
			} else if (e instanceof Rejection) errors.push(...e.issues);
			else throw e;
		}
	}
	return result;
}

export function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export function optional<T>(validator: Validator<T>, fallback: T): Validator<T>;
export function optional<T extends Record<string, I<any>>>(obj: T): Validator<undefined | N<T>>;
export function optional(validator: any, fallback?: any): Validator<any> {
	if (typeof validator === 'function') {
		return (input) => (input === void 0 ? fallback : validator(input));
	}
	return (input) => {
		if (input === void 0) return undefined;
		const errors: Options['errors'] = [];
		const result = check({ input, schema: validator, errors });
		if (errors.length) throw new Rejection(errors);
		return result;
	};
}

export function boolean<T = boolean>(transform?: (value: boolean) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'boolean') {
			throw { expected: 'boolean', message: `[UnexpectedInput] Received "${typeof input}"` };
		}
		return transform ? transform(input) : (input as T);
	};
}
export function number<T = number>(transform?: (value: number) => T): Validator<T> {
	return (input) => {
		switch (typeof input) {
			case 'number':
				break;
			case 'string': {
				if (input.trim() === '') {
					throw { expected: 'number', message: '[UnexpectedInput] Received empty string' };
				}
				input = Number(input);
				break;
			}
			case 'boolean': {
				input = input ? 1 : 0;
				break;
			}
			case 'bigint': {
				if (input > Number.MAX_SAFE_INTEGER || input < Number.MIN_SAFE_INTEGER) {
					throw {
						expected: 'number',
						message: '[UnsafeCast] BigInt value exceeds safe integer range',
					};
				}
				input = Number(input);
				break;
			}
			default: {
				throw { expected: 'number', message: `[UnexpectedInput] Received "${typeof input}"` };
			}
		}
		if (Number.isNaN(input)) {
			throw { expected: 'number', message: '[UnexpectedInput] Received "NaN"' };
		}

		return transform ? transform(input as number) : (input as T);
	};
}
export function string<T = string>(transform?: (value: string) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'string') {
			throw { expected: 'string', message: `[UnexpectedInput] Received "${typeof input}"` };
		}
		return transform ? transform(input) : (input as T);
	};
}
export function literal<const T extends readonly string[]>(...values: T): Validator<T[number]> {
	return (input) => {
		if (values.length === 0) {
			throw { expected: 'literal', message: '[InvalidSchema] No values provided' };
		}
		if (typeof input !== 'string') {
			throw { expected: 'literal', message: `[UnexpectedInput] Received "${typeof input}"` };
		}
		if (!values.includes(input)) {
			throw {
				expected: 'literal',
				message: `[InvalidInput] "${input}" is not in [${values.join(', ')}]`,
			};
		}
		return input;
	};
}

export function date<T = Date>(transform?: (value: Date) => T): Validator<T> {
	return (input) => {
		const d = input instanceof Date ? new Date(input.getTime()) : new Date(input as any);
		if (Number.isNaN(d.getTime())) {
			throw { expected: 'date', message: `[InvalidInput] Received "Invalid Date" from ${input}` };
		}
		return transform ? transform(d) : (d as T);
	};
}
export function array<T, R = T[]>(
	item: Validator<T>,
	transform?: (values: T[]) => R,
): Validator<R> {
	return (input) => {
		if (!Array.isArray(input)) {
			const type = typeof input === 'object' ? 'non-array object' : typeof input;
			throw { expected: 'array', message: `[UnexpectedInput] Received "${type}"` };
		}
		const result = input.map((v) => item(v));
		return transform ? transform(result) : (result as R);
	};
}
export function record<T, R = Record<string, T>>(
	value: Validator<T>,
	transform?: (record: Record<string, T>) => R,
): Validator<R> {
	return (input) => {
		if (typeof input !== 'object' || input == null) {
			const type = typeof input === 'object' ? 'null or undefined' : typeof input;
			throw { expected: 'record', message: `[UnexpectedInput] Received "${type}"` };
		}
		if (Array.isArray(input)) {
			throw { expected: 'record', message: '[InvalidInput] Received an array' };
		}
		const result: Record<string, T> = {};
		for (const key in input) {
			result[key] = value((input as any)[key]);
		}
		return transform ? transform(result) : (result as R);
	};
}
