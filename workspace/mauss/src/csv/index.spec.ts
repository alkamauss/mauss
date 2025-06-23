import { describe } from 'vitest';
import { read } from './index.js';

describe('csv', ({ concurrent: it }) => {
	it('parse csv with simple values', ({ expect }) => {
		const parsed = read('1,2,3,4,5');
		const json = [['1', '2', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with quoted values', ({ expect }) => {
		const parsed = read('"1","2","3","4","5"');
		const json = [['1', '2', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with mixed values', ({ expect }) => {
		const parsed = read('1,"2",3,"4",5');
		const json = [['1', '2', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with escaped quotes', ({ expect }) => {
		const parsed = read('"1","2 w/ escaped ""double quotes""","3","4","5"');
		const json = [['1', '2 w/ escaped "double quotes"', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with commas in values', ({ expect }) => {
		const parsed = read('"1","2, w/ commas","3","4","5"');
		const json = [['1', '2, w/ commas', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with newlines in values', ({ expect }) => {
		const parsed = read('"1","2 w/ newlines\nin value","3","4","5"');
		const json = [['1', '2 w/ newlines\nin value', '3', '4', '5']];
		expect(parsed).toEqual(json);
	});

	it('parse csv with mixed quotes and commas', ({ expect }) => {
		const parsed = read(
			'"1st col","2 w/ escaped ""double quotes""","3, w/, commas",4 w/ no quotes,"5 w/ CRLF\r\n"',
		);
		const json = [
			[
				'1st col',
				'2 w/ escaped "double quotes"',
				'3, w/, commas',
				'4 w/ no quotes',
				'5 w/ CRLF\r\n',
			],
		];
		expect(parsed).toEqual(json);
	});

	it('parse edge cases correctly', ({ expect }) => {
		const parsed = read(
			'"1st col","2 w/ escaped """" double quotes""","3, w/, commas",4 w/ no quotes,"5 w/ CRLF\r\n"\r\n"1st col","2 w/ escaped """" double quotes""","3, w/, commas",4 w/ no quotes,"5 w/ CRLF\r\n"',
		);

		const json = [
			[
				'1st col',
				'2 w/ escaped "" double quotes"',
				'3, w/, commas',
				'4 w/ no quotes',
				'5 w/ CRLF\r\n',
			],
			[
				'1st col',
				'2 w/ escaped "" double quotes"',
				'3, w/, commas',
				'4 w/ no quotes',
				'5 w/ CRLF\r\n',
			],
		];

		expect(parsed).toEqual(json);
	});
});
