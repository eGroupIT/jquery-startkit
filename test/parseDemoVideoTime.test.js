import parseDemoVideoTime from '../src/js/lib/parseDemoVideoTime.js';

const videoCurrentTime = '20.364068';

const videoCurrentTime2 = '8.364068';

const videoCurrentTime3 = '61.364068';

test('time > 10', () => {
	expect(parseDemoVideoTime(videoCurrentTime)).toBe('0:20');
});

test('time < 10', () => {
	expect(parseDemoVideoTime(videoCurrentTime2)).toBe('0:08');
});

test('time > 60', () => {
	expect(parseDemoVideoTime(videoCurrentTime3)).toBe('1:01');
});
