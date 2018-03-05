import createDemoTimelineArray from '../src/js/lib/createDemoTimelineArray.js';

const videoDuration = 1.4;
const timeLineData = [{
	startAt: 0,
	duration: 2,
}];

const videoDuration1 = 7.3;
const timeLineData1 = [{
	startAt: 0,
	duration: 2,
}, {
	startAt: 5,
	duration: 3,
}];

const videoDuration2 = 16.3;
const timeLineData2 = [{
	startAt: 0,
	duration: 6,
}, {
	startAt: 7,
	duration: 5,
}, {
	startAt: 15,
	duration: 2,
}];

test('continuous timeLineData', () => {
	expect(createDemoTimelineArray(videoDuration, timeLineData)).toEqual([{
		width: 100,
		left: 0,
	}]);
});

test('discontinuous timeLineData', () => {
	expect(createDemoTimelineArray(videoDuration1, timeLineData1)).toEqual([{
		width: 29,
		left: 0,
	}, {
		width: 29,
		left: 71,
	}]);
});

test('discontinuous timeLineData2', () => {
	expect(createDemoTimelineArray(videoDuration2, timeLineData2)).toEqual([{
		width: 38,
		left: 0,
	}, {
		width: 31,
		left: 44,
	}, {
		width: 6,
		left: 94,
	}]);
});
