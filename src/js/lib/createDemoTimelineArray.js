import _forEach from 'lodash/forEach';

export default function createDemoTimelineArray(videoDuration, timeLineData) {
	const videoTotal = Math.round(videoDuration);
	const array = [];
	_forEach(timeLineData, (value) => {
		const left = (value.startAt / videoTotal) * 100;
		let width = (value.duration / videoTotal) * 100;
		if (value.duration + value.startAt > videoTotal) {
			width = (1 - (value.startAt / videoTotal)) * 100;
		}
		array.push({
			width: Math.round(width),
			left: Math.round(left),
		});
	});
	return array;
}
