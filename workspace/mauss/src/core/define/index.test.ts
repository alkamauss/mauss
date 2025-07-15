import { define } from './index.js';

declare function expect<T>(v: T): void;
type IsNever<T> = [T] extends [never] ? true : false;
type IsOptional<T> = undefined extends T ? true : false;

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

	define(({ string }) => ({ uppercase: string((v) => v.toUpperCase()) }));
	define(({ string }) => ({ string: string((v) => v.length > 0 && v) }));

	expect<string>(define(({ string }) => string())({}));
	expect<number>(define(({ string }) => string((num) => +num))({}));

	expect<string>(define(({ string }) => ({ title: string() }))({}).title);
	expect<number>(define(({ string }) => ({ average: string((avg) => +avg) }))({}).average);

	() => {
		const schema = define(({ optional, string }) => ({
			title: string(),
			description: optional(string()),
		}))({});
		expect<string>(schema.title);
		expect<undefined | string>(schema.description);
	};

	() => {
		const schema = define(({ optional, string }) => ({
			user: { name: string(), age: optional(string((age) => +age)) },
		}))({});
		expect<string>(schema.user.name);
		expect<undefined | number>(schema.user.age);
	};

	(/* optional defined array */) => {
		const optional = define(({ optional, array, string }) => ({
			alias: optional(array(string())),
		}))({});
		expect<undefined | string[]>(optional.alias);

		const fallback = define(({ optional, array, string }) => ({
			alias: optional(array(string()), []),
		}))({});
		expect<IsOptional<typeof fallback.alias>>(false);
		expect<IsNever<(typeof fallback.alias)[0]>>(false);
		expect<string>(fallback.alias[0]);
	};

	(/* optional defined object */) => {
		const schema = define(({ optional, string }) => ({
			soundtrack: optional({
				name: string(),
				type: optional(string()),
				artist: string(),
				youtube: optional(string()),
			}),
		}))({});

		expect<IsOptional<typeof schema.soundtrack>>(true);
		if (schema.soundtrack) {
			expect<string>(schema.soundtrack.name);
			expect<undefined | string>(schema.soundtrack.type);
			expect<string>(schema.soundtrack.artist);
			expect<undefined | string>(schema.soundtrack.youtube);
		}
	};

	(/* object defined in array */) => {
		const schema = define(({ optional, array, string }) => ({
			soundtrack: optional(
				array({
					name: string(),
					type: optional(string()),
					artist: string(),
					youtube: optional(string()),
				}),
			),
		}))({});

		expect<IsOptional<typeof schema.soundtrack>>(true);
		if (schema.soundtrack && schema.soundtrack.length) {
			const [track] = schema.soundtrack;
			expect<string>(track.name);
			expect<undefined | string>(track.type);
			expect<string>(track.artist);
			expect<undefined | string>(track.youtube);
		}
	};
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
		rating: r.optional(
			r.record(
				r.array(
					r.record(r.string(), (o) => Object.values(o).reduce((a, c) => +c + a, 0)),
					(category) => category.reduce((a, c) => +c + a, 0) / category.length,
				),
				(rubric) => {
					const ratings = Object.values(rubric);
					const total = ratings.reduce((a, c) => +c + a, 0);
					return Math.round((total / ratings.length + Number.EPSILON) * 100) / 100;
				},
			),
			-1,
		),
		completed: r.optional(r.string()),
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
	expect<number>(metadata.rating);
	expect<undefined | string>(metadata.completed);
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
