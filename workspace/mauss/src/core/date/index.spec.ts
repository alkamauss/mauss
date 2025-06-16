import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { date } from './index.js';

const suites = {
	'date/base': suite('date/base'),
	'date/to.relative': suite('date/to.relative'),
	'date/format': suite('date/format'),
};

suites['date/base']('throw on invalid date', () => {
	assert.throws(() => date('invalid'));
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
	const test = date('2017/09/08, 13:02:03');

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
});

Object.values(suites).forEach((v) => v.run());
