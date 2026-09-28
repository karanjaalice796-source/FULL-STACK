const assert = require('node:assert/strict');
const { test } = require('node:test');

const { returnNumbers, isValidFullName } = require('./regex-exercises');
const displayDateFiveDaysFromNow = require('./date-fns-usage/date-operations');
const displayFileInfo = require('./file-management/file-info');

test('returnNumbers extracts digits in their original order', () => {
	assert.equal(returnNumbers('k5k3q2g5z6x9bn'), '532569');
	assert.equal(returnNumbers('no digits'), '');
});

test('isValidFullName accepts two capitalized names only', () => {
	assert.equal(isValidFullName('Alice Smith'), true);
	assert.equal(isValidFullName('alice Smith'), false);
	assert.equal(isValidFullName('Alice Smith Jones'), false);
});

test('date operation returns a date five days in the future', () => {
	const { now, futureDate, formattedDate } = displayDateFiveDaysFromNow();

	assert.equal(futureDate.getTime() - now.getTime(), 5 * 24 * 60 * 60 * 1000);
	assert.match(formattedDate, /\d{4}/);
});

test('file-info reports the example file', () => {
	const info = displayFileInfo();

	assert.equal(info.exists, true);
	assert.equal(typeof info.size, 'number');
	assert.ok(info.size > 0);
	assert.ok(info.createdAt instanceof Date);
});
