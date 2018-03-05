export default function toggleFullPageLoader() {
	const $fullPageLoader = $('#fullPageLoader');
	if ($fullPageLoader.css('display') === 'none') {
		$fullPageLoader.css('display', 'block');
	} else {
		$fullPageLoader.css('display', 'none');
	}
}
