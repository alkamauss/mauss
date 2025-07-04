# mauss

> practical functions and reusable configurations

A lightweight and modular utility library for writing declarative, type-safe code

```bash
pnpm add mauss
```

## Why?

The best of both worlds

1. The conciseness of the functional paradigm — [less is more](https://spectrum.ieee.org/functional-programming)
2. The predictability of pure function and consistent behavior
3. The readability of declarative immutability and clear data flow
4. The performance of imperative JavaScript when it counts

> Write concise, declarative code with no side effects — without sacrificing performance or maintainability

Natively, JavaScript includes functional patterns through built-in array methods like `.map`, `.filter`, and `.reduce`, which makes it easy to compose logic through chaining. However, JavaScript is considered as a [multi-paradigm](https://en.wikipedia.org/wiki/JavaScript) [scripting language](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript) — not a purely functional one like [Haskell](https://www.haskell.org/). It is _not_ optimized for the functional paradigm, especially heavy functional chaining. As the codebase grows in size and complexity, performance and maintainability often suffer.

With `mauss`, you can write shorter, simpler, more declarative code without the overhead of deep chaining or over-abstractions. It encourages clarity and composition while staying close to JavaScript's performance model. Of course, no utility library replaces good design. `mauss` doesn't prevent bad practices — but it nudges you toward better ones.

## Usage

`mauss` is modular, tree-shakeable, and comes with no dependencies — import only what you need, let your bundler do the rest. Let's start with some convenience exports to quickly get you started with any projects, such as:

<!-- use `size-limit` to show the minimal footprint -->

### `/prettier.config.js`

An opinionated Prettier config for consistent code style with zero setup. Just point to it in your `package.json`:

```json
{
	"prettier": "mauss/prettier.config.js"
}
```

This config includes:

- Ignore rules for `pnpm-lock.yaml` and generated directories like `.svelte-kit/`
- Support for `*.svelte` files via [`prettier-plugin-svelte`](https://github.com/sveltejs/prettier-plugin-svelte) (install separately)
- Optional sorting for `package.json` via [`prettier-plugin-sort-package-json`](https://github.com/ignatiusmb/prettier-plugin-sort-package-json) (install separately)

### `/tsconfig.json`

A minimal base `tsconfig` with strict type-checking and sensible defaults for consistent project environments. Designed to reduce boilerplate and encourage best practices. Just extend it in your `tsconfig.json`:

```json
{
	"extends": "mauss/tsconfig.json"
}
```
