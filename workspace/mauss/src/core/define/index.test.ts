import { define } from './index.js';

declare function expect<T>(v: T): void;
type V<T> = (input: unknown) => T;

(/* define */) => {
	define((r) => ({
		string: r.string(),
		number: r.number(),
		boolean: r.boolean(),
		literal: r.literal('a', 'b', 'c'),
		optional: r.optional(r.string()),
		date: r.date(),
		array: r.array(r.string()),
		object: r.record(r.string()),
		nested: {
			inner: r.record(r.string()),
			optional: r.optional(r.record(r.string())),
		},
	}));

	expect<V<string>>(define(({ string }) => string()));
	expect<V<number>>(define(({ string }) => string((num) => +num)));

	expect<V<{ title: string }>>(define(({ string }) => ({ title: string() })));
	expect<V<{ average: number }>>(define(({ string }) => ({ average: string((avg) => +avg) })));

	expect<V<{ title: string; description?: string }>>(
		define((rules) => ({ title: rules.string(), description: rules.string() })),
	);

	expect<V<{ user: { name: string } }>>(define(({ string }) => ({ user: { name: string() } })));
	expect<V<{ user: { name: string; age?: number } }>>(
		define((rules) => ({
			user: { name: rules.string(), age: rules.optional(rules.string((age) => +age)) },
		})),
	);

	define((rules) => ({
		string: rules.string((v) => v.toUpperCase()),
	}));

	define((rules) => ({
		string: rules.string((v) => v.length > 0 && v),
	}));
};

(/* review */) => {
	const schema = define((r) => ({
		slug: r.string(),
		category: r.string(),

		date: r.string(),
		released: r.string(),
		composed: r.number(),
		title: {
			short: r.optional(r.string()),
			en: r.string(),
			jp: r.optional(r.string()),
		},
		genres: r.array(r.string()),
		rating: r.optional(r.number()),
		completed: r.optional(r.number()),
		verdict: r.literal('pending', 'not-recommended', 'contextual', 'recommended', 'must-watch'),

		backdrop: r.optional(r.string()),
		image: {
			en: r.string(),
			jp: r.optional(r.string()),
		},

		seen: { first: r.string(), last: r.optional(r.string()) },
		link: r.optional(r.record(r.array(r.string())), {}),
	}));

	const metadata = schema({}); // mocked data
	expect<string>(metadata.slug);
	expect<string>(metadata.category);
	expect<string>(metadata.date);
	expect<string>(metadata.released);
	expect<number>(metadata.composed);
	expect<undefined | string>(metadata.title.short);
	expect<string>(metadata.title.en);
	expect<undefined | string>(metadata.title.jp);
	expect<string[]>(metadata.genres);
	expect<undefined | number>(metadata.rating);
	expect<undefined | number>(metadata.completed);
	expect<'pending' | 'not-recommended' | 'contextual' | 'recommended' | 'must-watch'>(
		metadata.verdict,
	);
	expect<undefined | string>(metadata.backdrop);
	expect<string>(metadata.image.en);
	expect<undefined | string>(metadata.image.jp);
	expect<string>(metadata.seen.first);
	expect<undefined | string>(metadata.seen.last);
	expect<Record<string, string[]>>(metadata.link);
};
