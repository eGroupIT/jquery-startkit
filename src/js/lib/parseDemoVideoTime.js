export default function parseDemoVideoTime(time) {
	const sec = parseInt(time, 10); // don't forget the second param
	const hours = Math.floor(sec / 3600);
	const minutes = Math.floor((sec - (hours * 3600)) / 60);
	let seconds = sec - (hours * 3600) - (minutes * 60);

	// if (hours < 10) { hours = `0${hours}`; }
	// if (minutes < 10) { minutes = `0${minutes}`; }
	if (seconds < 10) { seconds = `0${seconds}`; }
	return `${minutes}:${seconds}`;
}
