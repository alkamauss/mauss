import { describe } from 'vitest';
import { arrange, drill } from './customized.js';

describe('customized', ({ concurrent: it }) => {
	it('arrange is a function', ({ expect }) => {
		expect(arrange).toBeTypeOf('function');
	});
	it('drill is a function', ({ expect }) => {
		expect(drill).toBeTypeOf('function');
	});

	it('arrange sorts with given order', ({ expect }) => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June'];
		const list = ['March', 'June', 'May', 'April', 'January', 'June', 'February'];
		const result = ['January', 'February', 'March', 'April', 'May', 'June', 'June'];
		expect(list.sort(arrange(months))).toEqual(result);
	});

	it('drill sorts nested objects with given order', ({ expect }) => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June'];
		const posts = [
			{ date: { pub: { month: 'March' } } },
			{ date: { pub: { month: 'June' } } },
			{ date: { pub: { month: 'May' } } },
			{ date: { pub: { month: 'April' } } },
			{ date: { pub: { month: 'January' } } },
			{ date: { pub: { month: 'June' } } },
			{ date: { pub: { month: 'February' } } },
		];
		expect(posts.sort(drill('date.pub.month', arrange(months)))).toEqual([
			{ date: { pub: { month: 'January' } } },
			{ date: { pub: { month: 'February' } } },
			{ date: { pub: { month: 'March' } } },
			{ date: { pub: { month: 'April' } } },
			{ date: { pub: { month: 'May' } } },
			{ date: { pub: { month: 'June' } } },
			{ date: { pub: { month: 'June' } } },
		]);
	});
});
