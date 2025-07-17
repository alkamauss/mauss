export function stylize(input: string, target: 'camel' | 'kebab' | 'snake' | 'pascal' | 'title') {
	const words = input
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
		.split(/[_\- ]+/g)
		.map((w) => w.toLowerCase());

	switch (target) {
		case 'camel': {
			const capitalized = words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1));
			return words[0] + capitalized.join('');
		}
		case 'kebab':
			return words.join('-');
		case 'pascal':
			return words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
		case 'snake':
			return words.join('_');
		case 'title':
			return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
	}
}
