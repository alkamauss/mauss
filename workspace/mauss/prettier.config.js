/** @param {string} plugin */
function detect(plugin) {
	try {
		// out from experimental since v18.19 and v20.6
		// https://nodejs.org/api/esm.html#importmetaresolvespecifier
		import.meta.resolve(plugin);
		return true;
	} catch (error) {
		return false;
	}
}

const plugins = {
	'sort-package-json': detect('prettier-plugin-sort-package-json'),
};

const config = [
	plugins['sort-package-json'] && {
		files: 'package.json',
		options: {
			plugins: ['prettier-plugin-sort-package-json'],
		},
	},
	{
		files: ['pnpm-lock.yaml', '.svelte-kit/**/*'],
		options: {
			rangeEnd: 0,
		},
	},

	{
		files: '*.md',
		options: {
			tabWidth: 4,
		},
	},
	{
		files: '*.svelte',
		options: {
			plugins: ['prettier-plugin-svelte'],
			svelteSortOrder: 'options-scripts-markup-styles',
			svelteStrictMode: false,
			svelteAllowShorthand: true,
			svelteIndentScriptAndStyle: true,
		},
	},
	{
		files: '*.y*ml',
		options: {
			useTabs: false,
		},
	},
];

export default /** @type {import('prettier').Config} */ ({
	printWidth: 100,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	overrides: config.filter((o) => o),
});
