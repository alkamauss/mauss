import * as string from './index.js';

declare function expect<T>(v: T): void;

(/* tsf */) => {
	string.tsf('');
	string.tsf('/');
	string.tsf('/')({});
	string.tsf('/{?qs}')({});
	string.tsf('/{foo}')({ foo: (v) => v });
	string.tsf('/{foo}/{bar}')({ foo: 'hello', bar: () => 'world' });
	string.tsf('/{foo}/{bar}')({ foo: (v) => v, bar: (v) => v });
	string.tsf('/{v}/api/users{?qs}')({ v: 'v1' });
	string.tsf('/{foo}')({ foo: (v) => v.length > 1 && v.replace('o', 'u') });
	string.tsf('' as string)({ boo: (v) => v }); // index signature fallback
	string.tsf('' as `${string}/v1/posts/{id}/comments`)({ id: (v) => v });

	// ---- errors ----

	// @ts-expect-error
	string.tsf('{}');
	// @ts-expect-error
	string.tsf('/{}');
	// @ts-expect-error
	string.tsf('{}/');
	// @ts-expect-error
	string.tsf('/{{}}');
	// @ts-expect-error
	string.tsf('/{}}');
	// @ts-expect-error
	string.tsf('/{{}');
	// @ts-expect-error
	string.tsf('/{{}{');
	// @ts-expect-error
	string.tsf('/{{foo}}');
	// @ts-expect-error
	string.tsf('/{{foo}{');
	// @ts-expect-error
	string.tsf('/{}/{bar}');
	// @ts-expect-error
	string.tsf('/{foo}/{{}}');

	// @ts-expect-error
	string.tsf('/')();
	// @ts-expect-error
	string.tsf('/{foo}')();
	// @ts-expect-error
	string.tsf('/{foo}/{bar}')({});
	// @ts-expect-error
	string.tsf('/{foo}/{bar}')({ foo: (v) => v });
	// @ts-expect-error
	string.tsf('/{foo}')({ foo: (v) => v, bar: (v) => v });
	// @ts-expect-error
	string.tsf('' as `${string}/v1/posts/{id}/comments`)({});

	string.tsf('{hello-world}')({ 'hello-world': (v) => v });
};
