# mauss

> a lightweight and modular utility library for writing declarative, type-safe code

A focused set of modular, type-safe functions for writing compact declarative code.

## Installation

```bash
pnpm install mauss
```

### Why?

The best of both worlds

1. The conciseness of the functional paradigm — [less is more](https://spectrum.ieee.org/functional-programming)
2. The predictability of pure function and consistent behavior
3. The readability of declarative immutability and clear data flow
4. The performance of imperative JavaScript when it counts

> Write simpler, cleaner, more predictable code — without sacrificing performance or maintainability

Natively, JavaScript already have some functional patterns with built-in methods like `.map`, `.filter`, and `.reduce` that makes it easy to compose logic and can be chained together indefinitely. But there's a caveat, the language is considered as a [multi-paradigm](https://en.wikipedia.org/wiki/JavaScript) [scripting language](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript) — not a purely functional one like [Haskell](https://www.haskell.org/). This means it is _not_ optimized for the functional paradigm, functional chaining can quickly become inefficient or hard to maintain, especially at scale. You get neither the purity of FP nor the performance of low-level control, and the application performance will suffer heavily as the codebase grows.

With `mauss`, you can write shorter, simpler, more declarative code without the overhead of deep chaining or over-abstractions. It encourages clarity and composition while staying close to JavaScript's performance model. Of course, no utility library replaces good design. `mauss` doesn't prevent bad practices — but it nudges you toward better ones.
