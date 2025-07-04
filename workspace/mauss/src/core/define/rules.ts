type Validator<T = unknown> = (input: unknown) => never | T;

export function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export function optional<T>(validator: Validator<T>, fallback: T): Validator<T>;
export function optional<T>(validator: Validator<T>, fallback?: T): Validator<undefined | T> {
	return (input) => (input === void 0 ? fallback : validator(input));
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

export interface Rules {
	optional: typeof optional;
	boolean: typeof boolean;
	number: typeof number;
	string: typeof string;
	literal: typeof literal;
	date: typeof date;
	array: typeof array;
	record: typeof record;
}
