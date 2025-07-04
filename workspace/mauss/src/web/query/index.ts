import type { IndexSignature, Nullish, Primitives } from '../../typings/aliases.js';

/**
 * Query string decoder (`qsd`) decodes a query string into an object. It accepts a query string with or without the leading `?` and returns a mapped object of decoded query string
 *
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export function qsd(qs: string): Record<IndexSignature, undefined | Primitives[]> {
	if (!qs) return {};
	if (qs[0] === '?') qs = qs.slice(1);

	const dec = (s: string) => {
		if (!s.trim()) return '';
		s = decodeURIComponent(s.trim());
		if (['true', 'false'].includes(s)) return s[0] === 't';
		return Number.isNaN(Number(s)) ? s : Number(s);
	};

	const out: Record<string, Primitives[]> = {};
	const params = new URLSearchParams(qs);
	for (const [k, v] of params.entries()) {
		const cast = dec(v);
		if (!out[k]) out[k] = [cast];
		else out[k].push(cast);
	}
	return out;
}

type BoundValues = Nullish | Primitives;

/**
 * Query string encoder (`qse`) encodes key-value pairs from an object into a query string. It optionally accepts a second argument for a transformer function that will be applied to the final value if it exists, else an empty string will be returned
 *
 * @param bound  object with key-value pair to be updated in the URL, only accepts an object with nullish and primitive literals or an array of those values
 * @param transformer function that is applied to the final string if it exists, useful in cases where we want to add a leading `?` when the query exists but not when it's empty, or when we would like to append another existing query string after only if the output of `qse` exists
 * @returns final query string
 */
export function qse<T extends object>(
	bound: T[keyof T] extends BoundValues | readonly BoundValues[] ? T : never,
	transformer = (final: string) => `?${final}`,
): string {
	const params = new URLSearchParams();

	for (let [k, raw] of Object.entries(bound)) {
		if (raw == null) continue;
		if (Array.isArray(raw)) {
			for (const v of raw) {
				if (v == null) continue;
				const str = String(v).trim();
				if (str) params.append(k, str);
			}
			continue;
		}

		const str = String(raw).trim();
		if (str) params.set(k, str);
	}

	const final = params.toString();
	return final ? transformer(final) : final;
}
