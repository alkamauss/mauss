import { createBundle } from 'dts-buddy';
import pkg from '../package.json' with { type: 'json' };

await createBundle({
	output: 'index.d.ts',
	project: 'src/tsconfig.json',
	modules: Object.keys(pkg.exports).reduce((acc, key) => {
		if (key.slice(2).includes('.')) return acc;
		const entry = `./src/${key.slice(2) || 'core'}/index.js`;
		return { ...acc, ['mauss' + key.slice(1)]: entry };
	}, {}),
});
