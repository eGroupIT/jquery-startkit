import _forEach from 'lodash/forEach';
import _forInRight from 'lodash/forInRight';

import Video from 'class/Video';

import fetchWrapper from 'model/fetchWrapper';
import xhrWrapper from 'model/xhrWrapper';
import driftWindow from 'model/driftWindow';
import store from 'model/store';

import parseTimeHashmap from 'lib/parseTimeHashmap';
import parseDemoVideoTime from 'lib/parseDemoVideoTime';
import showAlert from 'lib/showAlert';
import showUploadProgress from 'lib/showUploadProgress';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';
import createDemoTimelineArray from 'lib/createDemoTimelineArray';

import persistedFaceList from 'apis/persistedFaceList';

const uploadStore = store();

function setThumbHeight() {
	$('.video__seekBarThumb').height($('#video-container').height() + 90);
}

function renderRecognizeResult(data) {
	let html = '';
	_forInRight(data, (value, key) => {
		html += `<div class="col mb-1">
							<img src="${S3IMAGEPATH}/face/detect/${value.persistedFacePath}" class="rounded mx-auto d-block selectable jsFace" width="100px" data-key="${key}"/>
							<p class="text-center">${key}</p>
						</div>`;
	});
	$('#recognizeResult').html(html);
}

function renderDemoTimeline(timeHashmap) {
	const $video = $('#video');
	const videoDuration = $video[0].duration;
	const timeLineData = parseTimeHashmap(timeHashmap);
	const demoTimelineArray = createDemoTimelineArray(videoDuration, timeLineData);
	let html = '';
	_forEach(demoTimelineArray, (value) => {
		html += `<div class="demo__timeline" style="width:${value.width}%;left:${value.left}%;"></div>`;
	});
	$('.demo__timelineContainer').html(html);
}

function recognizeVideo(fileName) {
	const $video = $('#video');
	const $inputUpload = $('#inputUpload');
	return fetchWrapper({
		url: fetchs.recognize.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				fileName,
				threshold: $('#inputThreshold').val(),
			}),
		},
		timeout: 1000000,
		beforeFetch: () => {
			showAlert('影片辨識中請稍候...', 'info', {
				duration: 3000,
			});
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				response.json().then((body) => {
					renderRecognizeResult(body);
					uploadStore.set('recognizeResult', body);
					$video[0].src = `/assets/video/${fileName}`;
					$video[0].load();
					$video[0].play();
					$inputUpload[0].value = '';
				});
			}
		},
		afterFetch: (response) => {
			$('#video-container').unwrap();
			statusAlert(fetchs.recognize.alerts, response.status);
		},
	});
}

function uploadVideo(file) {
	const $inputUpload = $('#inputUpload');
	const uploadDriftWindow = driftWindow('#uploadDriftWindow');
	const formdata = new FormData();
	formdata.append('file', file);
	return xhrWrapper({
		url: fetchs.uploadVideo.url,
		options: {
			method: 'POST',
			body: formdata,
		},
		timeout: 1000000,
		beforeFetch: () => {
			$(window).on('beforeunload', () => false);
			$inputUpload.attr('disabled', 'disabled');
			uploadDriftWindow.show();
			// clean dom
			$('.demo__timelineContainer').empty();
			$('#recognizeResult').empty();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				recognizeVideo(JSON.parse(response.response).fileName);
			}
		},
		afterFetch: (response) => {
			$(window).off('beforeunload');
			$inputUpload.attr('disabled', false);
			statusAlert(fetchs.uploadVideo.alerts, response.status);
		},
		onProgress: (event, startTime) => {
			showUploadProgress(event, startTime);
			if (event.loaded / event.total === 1) {
				uploadDriftWindow.hide();
				showAlert('影片處理中請稍候...', 'info', {
					duration: 3000,
				});
				$('#video-container').wrap('<div class="video__loader"></div>');
			}
		},
	});
}

function initVideo() {
	// Video
	setThumbHeight();
	$(window).on('resize', setThumbHeight);
	const video = new Video('#video-container', {
		timeupdateCb(elm) {
			$('.demo__time').text(parseDemoVideoTime(elm.currentTime));
		},
	});
	$('.demo__timelineContainer').on('mousedown', (e) => {
		video.onMouseDown(e);
	});
}

function initJsFace() {
	$(document).on('click', '.jsFace', function onJsFaceClick() {
		const key = $(this).data('key');
		renderDemoTimeline(uploadStore.get('recognizeResult')[key].timeHashmap);
		$('.jsFace').removeClass('selectable--selected');
		$(this).addClass('selectable--selected');
	});
}

function initInputThreshold() {
	const $inputThreshold = $('#inputThreshold');
	$inputThreshold.slider({
		formatter(value) {
			return `Current value: ${value}`;
		},
	});
	$inputThreshold.prev().prev().text(`調整辨識率(${$inputThreshold.val()})`);
	$inputThreshold.on('change', () => {
		$inputThreshold.prev().prev().text(`調整辨識率(${$inputThreshold.val()})`);
	});
}

function initInputUpload() {
	$('#inputUpload').on('change', function onInputUploadChange() {
		const file = this.files[0];
		if (file.size < 41943040) {
			uploadVideo(file);
		} else {
			showAlert('影片檔案大於40MB', 'danger');
		}
	});
}

export default function recognize() {
	persistedFaceList({
		fetchSuccess: (response) => {
			if (response.status === 200) {
				response.json().then((body) => {
					if (body.length === 0) {
						$('#recognizeRestrictModal').modal();
					} else {
						initInputUpload();
						initVideo();
						initJsFace();
						initInputThreshold();
					}
				});
			}
		},
	});
}
