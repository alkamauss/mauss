/**
 * A function to work with template strings and removes indentation based on the first line. This is useful when the template string is written with indentation for better readability, but the indentation is not desired in the final output.
 */
export function indent(text: string) {
	const lines = text.split(/\r?\n/).filter((l) => l.trim());
	const depth = (/^\s*/.exec(lines[0]) || [''])[0].length;
	return {
		depth,
		trim() {
			return lines.map((l) => l.slice(depth)).join('\n');
		},
	};
}
