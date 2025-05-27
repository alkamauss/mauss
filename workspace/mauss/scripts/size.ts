import type { SizeLimitConfig } from 'size-limit';
import pkg from '../package.json';

module.exports = Object.keys(pkg.exports)
	.filter((p) => !p.slice(1).includes('.'))
	.map((entry) => ({
		path: `src/${entry.slice(2) || 'core'}/index.ts`,
		name: `mauss/${entry === '.' ? 'core' : entry.slice(2)}`,
		import: '*',
	})) satisfies SizeLimitConfig;
