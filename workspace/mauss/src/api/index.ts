import type { Nullish } from '../typings/aliases.js';
import type { AlsoPromise } from '../typings/extenders.js';

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetcherConfig {
	/**
	 * Prepares an object to pass into fetch that is called before the request is sent, it receives the specified `method` and `to` url string, and optionally a `body`, `from` URL, and `headers` object. It should _prepare_ and return an object that satisfies the [`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) interface
	 * @param {RequestInit} opts request init options
	 * @default ({ method, body }) => ({ method, body: JSON.stringify(body) })
	 */
	prepare?(opts: {
		method: HTTPMethods;
		to: string;
		body?: BodyInit;
		from?: URL;
		headers?: Record<string, string>;
	}): RequestInit;
	/**
	 * Intercepts the `url` before the request passed to fetch
	 * @param {string} path url received from all api methods
	 * @default (url) => url
	 */
	intercept?(path: string): string;
	/**
	 * Catches error from `fetch` failure and returns a string
	 * @default () => 'NetworkError: Please try again later.'
	 */
	sweep?(exception: unknown): string;
	/**
	 * Transforms raw response to desired data structure, it receives the response and can return anything that will used as the `payload`
	 * @param {Response} res response object from fetch
	 * @default () => r.json().catch(() => ({}))
	 */
	transform?(res: Response): Promise<unknown>;
	/**
	 * Determines if fetcher should exit with an error, this function is called after the response is transformed and receives a clone of the initial response and the `payload`
	 * @param {Response} res response object from fetch
	 * @returns `string` if the request was unsuccessful or anything falsy if it was successful
	 * @default ({ ok }) => !ok && 'UnexpectedError: Try again later.'
	 */
	exit?(res: Response, payload: any): AlsoPromise<string | false | Nullish>;
}

export interface SendOptions {
	from?: URL;
	headers?: Record<string, string>;
	using?: typeof fetch;
}

/**
 * Fetcher factory to create a `send` function to make requests that abstracts the `fetch` API.
 *
 * @example
 *
 * ```javascript
 * import { fetcher, type SendOptions } from 'mauss/api';
 * const send = fetcher({
 *   prepare({ method, to, body }) {
 *     // ... do some checks or logging
 *     return {
 *       method: method || 'GET',
 *       mode: 'cors',
 *       credentials: 'include',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify(body),
 *     };
 *   },
 *   exit({ status }, payload) {
 *     if (status >= 500) return 'ServerError';
 *     if (status >= 400) return 'ClientError';
 *     // void or non-string means successful
 *   },
 * });
 * // use the `send` function above to make and export an abstraction
 * export const API = {
 *   // use getter to determine the template and infer the defined parameters
 *   get 'session/:id'() {
 *     // `tsf` function from 'mauss/std'
 *     const render = tsf('https://auth.example/{id}/login');
 *     return (params: Parameters<typeof render>[0], options: SendOptions = {}) => {
 *       const target = send(render(params), options);
 *       return {
 *         // ... abstraction methods, for example
 *         async post() {
 *           return await target.post();
 *         },
 *       };
 *     };
 *   },
 * };
 * ```
 */
export function fetcher({
	prepare = ({ method, body }) => ({ method, body: JSON.stringify(body) }),
	intercept = (url) => url,
	sweep = () => 'NetworkError: Please try again later.',
	transform = (r) => r.json().catch(() => ({})),
	exit = ({ ok }) => !ok && 'UnexpectedError: Try again later.',
}: FetcherConfig) {
	type InternalSend = SendOptions & {
		method: HTTPMethods;
		url: string;
		body?: any;
	};

	async function send<T>({
		headers,
		from,
		using,
		method,
		url,
		body,
	}: InternalSend): Promise<{ data?: T; error?: string }> {
		let response: Response;
		try {
			const opts = prepare({ method, to: url, body, from, headers });
			response = await (using || fetch)(intercept(url), opts);
		} catch (exception) {
			return { error: sweep(exception) };
		}

		const payload = (await transform(response.clone())) as T;
		const error = await exit(response.clone(), payload);
		if (error) return { error };
		return { data: payload };
	}

	return function http(url: string, options: SendOptions = {}) {
		return {
			get<T>() {
				return send<T>({ method: 'GET', url, ...options });
			},
			post<T>(payload?: any) {
				return send<T>({ method: 'POST', url, body: payload, ...options });
			},
			put<T>(payload?: any) {
				return send<T>({ method: 'PUT', url, body: payload, ...options });
			},
			delete<T>() {
				return send<T>({ method: 'DELETE', url, ...options });
			},
		};
	};
}
