import { UnaryFunction } from '../../typings/helpers.js';

/** Joins all given parameters together using `/`, regardless of the platform */
export function catenate(...paths: string[]): string {
	if (!paths.length) return '.';
	const index = paths[0].replace(/\\/g, '/').trim();
	if (paths.length === 1 && index === '') return '.';
	const parts = index.replace(/[/]*$/g, '').split('/');
	if (parts[0] === '') parts.shift();

	for (let i = 1; i < paths.length; i += 1) {
		const part = paths[i].replace(/\\/g, '/').trim();
		for (const slice of part.split('/')) {
			if (slice === '.') continue;
			if (slice === '..') parts.pop();
			else if (slice) parts.push(slice);
		}
	}

	return (index[0] === '/' ? '/' : '') + parts.join('/');
}

type Parse<T> = T extends `${string}{${infer P}}${infer R}` ? P | Parse<R> : never;
/**
 * A type-safe template string function that accepts a string template with placeholders and returns a function that can take in an object with the same keys as the placeholders. The function will replace the placeholders with the corresponding values from the object. Parameters of the braces can be prefixed with a question mark `?` to make it optional to the type system and will fallback to an empty string if it's not defined in the table.
 *
 * This assumes the braces inside the template string are balanced and not nested. The function will not throw an error if the braces are not balanced, but the result will be unexpected. If you're using TypeScript and are passing a [string literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), it will point out any unbalanced braces by throwing an error from the compiler.
 *
 * The template string is parsed into an array of strings, which are then executed with the provided table of functions, which is an object with the key being the name of the braces from the template string, and the value being the function to manipulate the name of the braces.
 *
 * @example
 *
 * ```javascript
 * import { tsf } from 'mauss/std';
 *
 * const render = tsf('https://api.example.com/v1/{category}/{id}');
 *
 * function publish({ category, id }) {
 *   const url = render({
 *     category: () => category !== 'new' && category,
 *     id: (v) => '<PREFIX>' + uuid(`${v}-${id}`),
 *   });
 *   return fetch(url);
 * }
 * ```
 *
 * @returns a function to replace the placeholders
 */
export function tsf<Input extends string>(
	template: Input extends `${string}{}${string}`
		? 'Empty braces are not allowed in template'
		: Input extends
					| `${string}{{${string}}}${string}`
					| `${string}{{${string}}${string}`
					| `${string}{${string}}}${string}`
			? 'Unbalanced braces detected in template'
			: Input,
) {
	const parts: string[] = [];
	for (let i = 0, start = 0; i < template.length; i += 1) {
		if (template[i] === '{') {
			if (i > start) parts.push(template.slice(start, i));

			const end = template.indexOf('}', i);
			if (end === -1 /** missing closing */) {
				parts.push(template.slice(i));
				break;
			}

			parts.push(template.slice(i + 1, end));
			start = (i = end) + 1;
		} else if (i === template.length - 1) {
			parts.push(template.slice(start));
		}
	}

	type AcceptedValues = string | false | null | undefined;
	type ExpectedProps = string extends Input ? string : Parse<Input>;
	type RequiredProps = Exclude<ExpectedProps, `?${string}`>;
	type OptionalProps = Extract<ExpectedProps, `?${string}`>;
	return function render(
		table: Record<RequiredProps, AcceptedValues | UnaryFunction<string, AcceptedValues>> & {
			[K in OptionalProps]?: AcceptedValues | UnaryFunction<string, AcceptedValues>;
		},
	) {
		let transformed = '';
		for (let i = 0; i < parts.length; i += 1) {
			const replace = table[parts[i] as keyof typeof table];
			if (typeof replace === 'function') {
				transformed += replace(parts[i]) || '';
			} else {
				transformed += replace || (parts[i][0] !== '?' && parts[i]) || '';
			}
		}
		return transformed;
	};
}
