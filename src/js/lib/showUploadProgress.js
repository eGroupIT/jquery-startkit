export default function showUploadProgress(event, startTime) {
	$('#uploadBar').width(`${Math.round((event.loaded / event.total) * 100)}%`);
}
