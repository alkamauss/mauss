import { attempt } from './index.js';

declare function expect<T>(v: T): void;

async (/* attempt */) => {
	type Result<T> = { data?: T; error?: unknown };

	expect<Promise<Result<void>>>(attempt(async () => {}));
	expect<Result<void>>(await attempt(async () => {}));
	expect<Result<void>>(attempt.sync(() => {}));

	expect<Promise<Result<string>>>(attempt(async () => ''));
	expect<Result<string>>(await attempt(async () => ''));
	expect<Result<string>>(attempt.sync(() => ''));
};
