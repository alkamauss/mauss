import { indent } from '../core/index.js';

type Primitives = null | boolean | string;
type FrontMatter = { [key: string]: Primitives | Primitives[] | FrontMatter | FrontMatter[] };
export function read(raw: string, memo: Record<string, any> = {}): FrontMatter[string] {
	const i = indent(raw);
	if (!/[:\-\[\]|#]/gm.test(raw)) {
		return i.depth > 1 ? i.trim() : coerce(raw.trim());
	}
	if (i.depth <= 1) raw = raw.trimStart();
	if (/^(".*"|'.*')$/.test(raw.trim())) {
		return raw.trim().slice(1, -1);
	}

	const PATTERN = /(^[^:\s]+):(?!\/)\n?([\s\S]*?(?=^\S)|[\s\S]*$)/gm;
	let match: null | RegExpExecArray;
	while ((match = PATTERN.exec(raw))) {
		const [, key, value] = match;
		const data = read(indent(value).trim(), memo[key]);
		if (Array.isArray(data) || typeof data !== 'object') memo[key] = data;
		else memo[key] = { ...memo[key], ...data };
	}

	if (Object.keys(memo).length) return memo;

	const cleaned = raw.replace(/#.*$/gm, '').trim();
	switch (cleaned[0]) {
		case '-': {
			const sequence = cleaned.split('-').filter((v) => v);
			return sequence.map((v) => read(indent(v).trim()) as FrontMatter);
		}
		case '[': {
			const pruned = cleaned.slice(1, -1);
			return pruned.split(',').map(coerce);
		}
		case '|': {
			return indent(cleaned.slice(1).replace('\n', '')).trim();
		}
		default: {
			return coerce(cleaned.trim());
		}
	}
}

// ---- internal functions ----

function coerce(u: string) {
	const v = u.trim(); // argument can be passed as-is
	const map = { true: true, false: false, null: null };
	if (v in map) return map[v as keyof typeof map];
	// if (!Number.isNaN(Number(v))) return Number(v);
	return /^(".*"|'.*')$/.test(v) ? v.slice(1, -1) : v;
}
