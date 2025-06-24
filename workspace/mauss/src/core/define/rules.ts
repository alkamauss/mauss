import { InputError, InvalidInput, SchemaError } from './error.js';

type Validator<T = unknown> = (input: unknown) => never | T;

export function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export function optional<T>(validator: Validator<T>, fallback: T): Validator<T>;
export function optional<T>(validator: Validator<T>, fallback?: T): Validator<undefined | T> {
	return (input) => (input === void 0 ? fallback : validator(input));
}

export function boolean<T = boolean>(transform?: (value: boolean) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'boolean') throw new InputError('boolean', input);
		return transform ? transform(input) : (input as T);
	};
}
export function number<T = number>(transform?: (value: number) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'number') throw new InputError('number', input);
		if (Number.isNaN(input)) throw new InvalidInput('number', 'Received NaN');
		return transform ? transform(input) : (input as T);
	};
}
export function string<T = string>(transform?: (value: string) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'string') throw new InputError('string', input);
		return transform ? transform(input) : (input as T);
	};
}
export function literal<const T extends readonly string[]>(...values: T): Validator<T[number]> {
	return (input) => {
		if (values.length === 0) {
			throw new SchemaError('Literal validator requires at least one value');
		}
		if (typeof input !== 'string') {
			throw new InputError('literal', input);
		}
		if (!values.includes(input)) {
			throw new InvalidInput('literal', `"${input}" is not in [${values.join(', ')}]`);
		}
		return input;
	};
}

export function date<T = Date>(transform?: (value: Date) => T): Validator<T> {
	return (input) => {
		if (!(input instanceof Date)) throw new InputError('date', input);
		if (Number.isNaN(input.getTime())) throw new InvalidInput('date', 'Received an invalid date');
		return transform ? transform(input) : (input as T);
	};
}
export function array<T, R = T[]>(
	item: Validator<T>,
	transform?: (values: T[]) => R,
): Validator<R> {
	return (input) => {
		if (!Array.isArray(input)) throw new InputError('array', input);
		const result = input.map((v) => item(v));
		return transform ? transform(result) : (result as R);
	};
}
export function record<T>(value: Validator<T>): Validator<Record<string, T>> {
	return (input) => {
		if (typeof input !== 'object') throw new InputError('record', input);
		if (input == null) throw new InvalidInput('record', 'Received null or undefined');
		if (Array.isArray(input)) throw new InvalidInput('record', 'Received an array');
		const result: Record<string, T> = {};
		for (const key in input) {
			result[key] = value((input as any)[key]);
		}
		return result;
	};
}
