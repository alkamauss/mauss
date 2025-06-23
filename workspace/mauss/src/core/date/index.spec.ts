import { describe } from 'vitest';
import { date } from './index.js';

describe('date', ({ concurrent: it }) => {
	const DATE = '2017/09/08, 13:02:03';

	it('base case', ({ expect }) => {
		expect(date).toBeTypeOf('function');
		expect(() => date('invalid')).toThrow('Invalid date: invalid');
	});
	it('create date from string', ({ expect }) => {
		const test = date(DATE).raw;
		expect(test).toBeInstanceOf(Date);
		expect(test.getFullYear()).toBe(2017);
		expect(test.getMonth()).toBe(8); // 0-indexed months
		expect(test.getDate()).toBe(8);
		expect(test.getHours()).toBe(13);
		expect(test.getMinutes()).toBe(2);
		expect(test.getSeconds()).toBe(3);
		expect(test.getMilliseconds()).toBe(0);
	});
	it('clone date', ({ expect }) => {
		const original = date(DATE);
		const clone = original.clone();
		expect(original !== clone).toBe(true);
		expect(clone.raw.getTime()).toBe(original.raw.getTime());
	});

	it('add milliseconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1000, 'millisecond').raw.getTime()).toBe(test.raw.getTime() + 1000);
	});
	it('add seconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'second').raw.getTime()).toBe(test.raw.getTime() + 1000);
	});
	it('add minutes', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'minute').raw.getTime()).toBe(test.raw.getTime() + 60_000);
	});
	it('add hours', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'hour').raw.getTime()).toBe(test.raw.getTime() + 3_600_000);
	});
	it('add days', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'day').raw.getTime()).toBe(test.raw.getTime() + 86_400_000);
	});
	it('add months', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'month').raw.getTime()).toBe(date('2017/10/08, 13:02:03').raw.getTime());
	});
	it('add years', ({ expect }) => {
		const test = date(DATE);
		expect(test.add(1, 'year').raw.getTime()).toBe(date('2018/09/08, 13:02:03').raw.getTime());
	});

	it('subtract milliseconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1000, 'millisecond').raw.getTime()).toBe(test.raw.getTime() - 1000);
	});
	it('subtract seconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'second').raw.getTime()).toBe(test.raw.getTime() - 1000);
	});
	it('subtract minutes', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'minute').raw.getTime()).toBe(test.raw.getTime() - 60_000);
	});
	it('subtract hours', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'hour').raw.getTime()).toBe(test.raw.getTime() - 3_600_000);
	});
	it('subtract days', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'day').raw.getTime()).toBe(test.raw.getTime() - 86_400_000);
	});
	it('subtract months', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'month').raw.getTime()).toBe(
			date('2017/08/08, 13:02:03').raw.getTime(),
		);
	});
	it('subtract years', ({ expect }) => {
		const test = date(DATE);
		expect(test.subtract(1, 'year').raw.getTime()).toBe(date('2016/09/08, 13:02:03').raw.getTime());
	});

	it('delta in milliseconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/09/08, 13:02:04').milliseconds).toBe(-1000);
	});
	it('delta in seconds', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/09/08, 13:02:04').seconds).toBe(-1);
	});
	it('delta in minutes', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/09/08, 13:03:03').minutes).toBe(-1);
	});
	it('delta in hours', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/09/08, 14:02:03').hours).toBe(-1);
	});
	it('delta in days', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/09/09, 13:02:03').days).toBe(-1);
	});
	it('delta in months', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2017/10/08, 13:02:03').months).toBe(-1);
	});
	it('delta in years', ({ expect }) => {
		const test = date(DATE);
		expect(test.delta('2018/09/08, 13:02:03').years).toBe(-1);
	});

	it('is before another date', ({ expect }) => {
		const test = date(DATE);
		expect(test.is.before('2017/09/08, 13:02:04')).toBe(true);
		expect(test.is.before('2017/09/08, 13:02:03')).toBe(false);
		expect(test.is.before('2017/09/08, 13:02:02')).toBe(false);
	});
	it('is after another date', ({ expect }) => {
		const test = date(DATE);
		expect(test.is.after('2017/09/08, 13:02:02')).toBe(true);
		expect(test.is.after('2017/09/08, 13:02:03')).toBe(false);
		expect(test.is.after('2017/09/08, 13:02:04')).toBe(false);
	});
	it('is same as another date', ({ expect }) => {
		const test = date(DATE);
		expect(test.is.same('2017/09/08, 13:02:03')).toBe(true);
		expect(test.is.same('2017/09/08, 13:02:04')).toBe(false);
		expect(test.is.same('2017/09/08, 13:02:02')).toBe(false);
	});

	it('default relative', ({ expect }) => {
		const now = new Date('2025-06-14T12:00:00Z');

		expect(date('2025-06-14T12:00:00Z').to.relative(now)).toBe('now');
		expect(date('2025-06-14T12:00:03Z').to.relative(now)).toBe('in 3 seconds');
		expect(date('2025-06-14T12:01:00Z').to.relative(now)).toBe('in 1 minute');
		expect(date('2025-06-14T15:00:00Z').to.relative(now)).toBe('in 3 hours');
		expect(date('2025-06-16T12:00:00Z').to.relative(now)).toBe('in 2 days');
		expect(date('2025-05-14T12:00:00Z').to.relative(now)).toBe('last month');
		expect(date('2023-06-14T12:00:00Z').to.relative(now)).toBe('2 years ago');
	});
	it('relative id', ({ expect }) => {
		const now = new Date('2025-06-14T12:00:00Z');

		expect(date('2025-06-14T12:00:00Z').to.relative(now, 'id')).toBe('sekarang');
		expect(date('2025-06-14T12:00:03Z').to.relative(now, 'id')).toBe('dalam 3 detik');
		expect(date('2025-06-14T12:01:00Z').to.relative(now, 'id')).toBe('dalam 1 menit');
		expect(date('2025-06-14T15:00:00Z').to.relative(now, 'id')).toBe('dalam 3 jam');
		expect(date('2025-06-16T12:00:00Z').to.relative(now, 'id')).toBe('lusa');
		expect(date('2025-05-14T12:00:00Z').to.relative(now, 'id')).toBe('bulan lalu');
		expect(date('2023-06-14T12:00:00Z').to.relative(now, 'id')).toBe('2 tahun yang lalu');
	});

	it('format date', ({ expect }) => {
		const test = date(DATE);

		expect(test.format('foo')).toBe('foo');

		expect(test.format('D')).toBe('8');
		expect(test.format('DD')).toBe('08');
		expect(test.format('DDD')).toBe('Fri');
		expect(test.format('DDDD')).toBe('Friday');
		expect(test.format('M')).toBe('9');
		expect(test.format('MM')).toBe('09');
		expect(test.format('MMM')).toBe('Sep');
		expect(test.format('MMMM')).toBe('September');
		expect(test.format('YY')).toBe('17');
		expect(test.format('YYYY')).toBe('2017');
		expect(test.format('H')).toBe('13');
		expect(test.format('HH')).toBe('13');
		expect(test.format('h')).toBe('1');
		expect(test.format('hh')).toBe('01');
		expect(test.format('m')).toBe('2');
		expect(test.format('mm')).toBe('02');
		expect(test.format('s')).toBe('3');
		expect(test.format('ss')).toBe('03');

		expect(test.format('DD/MM/YYYY!')).toBe('08/09/2017!');
		expect(test.format('YYYY-MM-DD ~ HH:mm:ss')).toBe('2017-09-08 ~ 13:02:03');
		expect(test.format('[valid format: YYYY-MM-DD ~ HH:mm:ss]')).toBe(
			'valid format: YYYY-MM-DD ~ HH:mm:ss',
		);
	});
});
