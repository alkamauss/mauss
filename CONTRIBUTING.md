# Contributors Guide

Thanks for taking the time to contribute!

Contributing goes a long way, there are lots of ways you can still help, even if you can't contribute to the code. All methods are outlined in the sections below, but the two main things other than code are testing and creating issues.

## Testing

The easiest way to contribute! By just using the software, you're already helping the project grows. Simply use and let us know if you run into problems, or there's some use case you would like to use it for but are not yet covered, this is the most common way we uncover bugs or implement new features. Open a [new issue](https://github.com/alkamauss/mauss/issues/new) or start a [new discussion](https://github.com/alkamauss/mauss/discussions/new).

## Documentation

Documentation is especially helpful! You can add something that hasn't been covered or is missing in the docs and help guide others with your experience.

## Developing

Follow this if you're looking to contribute to the code.

### Preparing

First step is to prepare your environment and make sure that [pnpm](https://pnpm.io/) is available to use, you can follow their [installation guide](https://pnpm.io/installation). The next step is to checkout the code by forking and cloning the repository.

```bash
corepack enable pnpm
git clone https://github.com/alkamauss/mauss mauss
cd mauss && pnpm i
```

## Maintaining

For maintainers of the project.

### Publishing

0. prepare a [new release draft](https://github.com/alkamauss/mauss/releases/new) with a new tag
1. bump version in [`package.json`](workspace/mauss/package.json) and commit with `~ vX.Y.Z`
2. publish release draft and title release with `X.Y.Z`
