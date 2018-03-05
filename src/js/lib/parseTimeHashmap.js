import _forIn from 'lodash/forIn';

/**
 * 把timeHashmap轉成可以顯示的資料格式
 */
export default function parseTimeHashmap(timeHashmap) {
	const array = [];
	let preSec = parseInt(Object.keys(timeHashmap)[0], 10);
	let startAt = preSec;
	let duration = 0;
	let index = 0;

	_forIn(timeHashmap, (value, key) => {
		const currentSec = parseInt(key, 10);
		if (index !== 0 && preSec + 1 !== currentSec) {
			array.push({
				startAt,
				duration,
			});
			duration = 0;
			startAt = currentSec;
		}
		preSec = currentSec;
		duration += 1;
		index += 1;
	});
	array.push({
		startAt,
		duration,
	});
	return array;
}
