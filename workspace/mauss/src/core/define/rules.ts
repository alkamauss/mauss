type Validator<T = unknown> = (input: unknown) => false | T;

export function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export function optional<T>(validator: Validator<T>, fallback: T): Validator<T>;
export function optional<T>(validator: Validator<T>, fallback?: T): Validator<undefined | T> {
	return (input) => (input === void 0 ? fallback : validator(input));
}

export function boolean<T = boolean>(transform?: (value: boolean) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'boolean') return false;
		return transform ? transform(input) : (input as T);
	};
}
export function number<T = number>(transform?: (value: number) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'number' || Number.isNaN(input)) return false;
		return transform ? transform(input) : (input as T);
	};
}
export function string<T = string>(transform?: (value: string) => T): Validator<T> {
	return (input) => {
		if (typeof input !== 'string') return false;
		return transform ? transform(input) : (input as T);
	};
}
export function literal<const T extends readonly string[]>(...values: T): Validator<T[number]> {
	return (input) => {
		if (typeof input !== 'string') return false;
		if (values.length === 0) return false;
		return values.includes(input) ? input : false;
	};
}

export function date<T = Date>(transform?: (value: Date) => T): Validator<T> {
	return (input) => {
		if (!(input instanceof Date) || Number.isNaN(input.getTime())) return false;
		return transform ? transform(input) : (input as T);
	};
}
export function array<T = unknown>(item: Validator<T>): Validator<T[]> {
	return (input) => {
		if (!Array.isArray(input)) return false;
		const result = input.map((v) => item(v));
		return !result.includes(false) && (result as T[]);
	};
}
export function record<T = unknown>(value: Validator<T>): Validator<Record<string, T>> {
	return (input) => {
		if (typeof input !== 'object' || input == null) return false;
		const result: Record<string, T> = {};
		for (const key in input) {
			const v = value((input as any)[key]);
			if (v === false) return false;
			result[key] = v;
		}
		return result;
	};
}
