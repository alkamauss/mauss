import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { date } from './index.js';

const suites = {
	'date/base': suite('date/base'),
	'date/add': suite('date/add'),
	'date/subtract': suite('date/subtract'),
	'date/delta': suite('date/delta'),
	'date/is.before': suite('date/is.before'),
	'date/is.after': suite('date/is.after'),
	'date/is.same': suite('date/is.same'),
	'date/to.relative': suite('date/to.relative'),
	'date/format': suite('date/format'),
};

const DATE = '2017/09/08, 13:02:03';

suites['date/base']('throw on invalid date', () => {
	assert.throws(() => date('invalid'));
});
suites['date/base']('create date from string', () => {
	const test = date(DATE).raw;
	assert.instance(test, Date);
	assert.equal(test.getFullYear(), 2017);
	assert.equal(test.getMonth(), 8);
	assert.equal(test.getDate(), 8);
	assert.equal(test.getHours(), 13);
	assert.equal(test.getMinutes(), 2);
	assert.equal(test.getSeconds(), 3);
	assert.equal(test.getMilliseconds(), 0);
});
suites['date/base']('clone date', () => {
	const original = date(DATE);
	const clone = original.clone();
	assert.ok(original !== clone);
	assert.equal(clone.raw.getTime(), original.raw.getTime());
});

suites['date/add']('add milliseconds', () => {
	const test = date(DATE);
	assert.equal(test.add(1000, 'millisecond').raw.getTime(), test.raw.getTime() + 1000);
});
suites['date/add']('add seconds', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'second').raw.getTime(), test.raw.getTime() + 1000);
});
suites['date/add']('add minutes', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'minute').raw.getTime(), test.raw.getTime() + 60_000);
});
suites['date/add']('add hours', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'hour').raw.getTime(), test.raw.getTime() + 3_600_000);
});
suites['date/add']('add days', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'day').raw.getTime(), test.raw.getTime() + 86_400_000);
});
suites['date/add']('add months', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'month').raw.getTime(), date('2017/10/08, 13:02:03').raw.getTime());
});
suites['date/add']('add years', () => {
	const test = date(DATE);
	assert.equal(test.add(1, 'year').raw.getTime(), date('2018/09/08, 13:02:03').raw.getTime());
});

suites['date/subtract']('subtract milliseconds', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1000, 'millisecond').raw.getTime(), test.raw.getTime() - 1000);
});
suites['date/subtract']('subtract seconds', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'second').raw.getTime(), test.raw.getTime() - 1000);
});
suites['date/subtract']('subtract minutes', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'minute').raw.getTime(), test.raw.getTime() - 60_000);
});
suites['date/subtract']('subtract hours', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'hour').raw.getTime(), test.raw.getTime() - 3_600_000);
});
suites['date/subtract']('subtract days', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'day').raw.getTime(), test.raw.getTime() - 86_400_000);
});
suites['date/subtract']('subtract months', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'month').raw.getTime(), date('2017/08/08, 13:02:03').raw.getTime());
});
suites['date/subtract']('subtract years', () => {
	const test = date(DATE);
	assert.equal(test.subtract(1, 'year').raw.getTime(), date('2016/09/08, 13:02:03').raw.getTime());
});

suites['date/delta']('delta in milliseconds', () => {
	const test = date(DATE);
	assert.equal(test.delta('2017/09/08, 13:02:04').milliseconds, -1000);
});
suites['date/delta']('delta in seconds', () => {
	const test = date(DATE);
	assert.equal(test.delta('2017/09/08, 13:02:04').seconds, -1);
});
suites['date/delta']('delta in minutes', () => {
	const test = date(DATE);
	assert.equal(test.delta('2017/09/08, 13:03:03').minutes, -1);
});
suites['date/delta']('delta in hours', () => {
	const test = date(DATE);
	assert.equal(test.delta('2017/09/08, 14:02:03').hours, -1);
});
suites['date/delta']('delta in days', () => {
	const test = date(DATE);
	assert.equal(test.delta('2017/09/09, 13:02:03').days, -1);
});
suites['date/delta']('delta in months', () => {
	const test = date(DATE);
	"2017/09/08, 13:02:03"
	assert.equal(test.delta('2017/10/08, 13:02:03').months, -1);
});
suites['date/delta']('delta in years', () => {
	const test = date(DATE);
	assert.equal(test.delta('2018/09/08, 13:02:03').years, -1);
});

suites['date/is.before']('is before another date', () => {
	const test = date(DATE);
	assert.ok(test.is.before('2017/09/08, 13:02:04'));
	assert.not(test.is.before('2017/09/08, 13:02:03'));
	assert.not(test.is.before('2017/09/08, 13:02:02'));
});
suites['date/is.after']('is after another date', () => {
	const test = date(DATE);
	assert.ok(test.is.after('2017/09/08, 13:02:02'));
	assert.not(test.is.after('2017/09/08, 13:02:03'));
	assert.not(test.is.after('2017/09/08, 13:02:04'));
});
suites['date/is.same']('is same as another date', () => {
	const test = date(DATE);
	assert.ok(test.is.same('2017/09/08, 13:02:03'));
	assert.not(test.is.same('2017/09/08, 13:02:04'));
	assert.not(test.is.same('2017/09/08, 13:02:02'));
});

suites['date/to.relative']('basic relative', () => {
	const now = new Date('2025-06-14T12:00:00Z');

	assert.equal(date('2025-06-14T12:00:00Z').to.relative(now), 'just now');
	assert.equal(date('2025-06-14T12:00:03Z').to.relative(now), 'in 3 seconds');
	assert.equal(date('2025-06-14T12:01:00Z').to.relative(now), 'in 1 minute');
	assert.equal(date('2025-06-14T15:00:00Z').to.relative(now), 'in 3 hours');
	assert.equal(date('2025-06-16T12:00:00Z').to.relative(now), 'in 2 days');
	assert.equal(date('2025-05-14T12:00:00Z').to.relative(now), '1 month ago');
	assert.equal(date('2023-06-14T12:00:00Z').to.relative(now), '2 years ago');
});

suites['date/format']('format date', () => {
	const test = date(DATE);

	assert.equal(test.format('foo'), 'foo');

	assert.equal(test.format('D'), '8');
	assert.equal(test.format('DD'), '08');
	assert.equal(test.format('DDD'), 'Fri');
	assert.equal(test.format('DDDD'), 'Friday');
	assert.equal(test.format('M'), '9');
	assert.equal(test.format('MM'), '09');
	assert.equal(test.format('MMM'), 'Sep');
	assert.equal(test.format('MMMM'), 'September');
	assert.equal(test.format('YY'), '17');
	assert.equal(test.format('YYYY'), '2017');
	assert.equal(test.format('H'), '13');
	assert.equal(test.format('HH'), '13');
	assert.equal(test.format('h'), '1');
	assert.equal(test.format('hh'), '01');
	assert.equal(test.format('m'), '2');
	assert.equal(test.format('mm'), '02');
	assert.equal(test.format('s'), '3');
	assert.equal(test.format('ss'), '03');

	assert.equal(test.format('DD/MM/YYYY!'), '08/09/2017!');
	assert.equal(test.format('YYYY-MM-DD ~ HH:mm:ss'), '2017-09-08 ~ 13:02:03');
	assert.equal(
		test.format('[valid format: YYYY-MM-DD ~ HH:mm:ss]'),
		'valid format: YYYY-MM-DD ~ HH:mm:ss',
	);
});

Object.values(suites).forEach((v) => v.run());
