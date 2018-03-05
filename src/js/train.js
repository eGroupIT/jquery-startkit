import _forIn from 'lodash/forIn';
import serialize from 'serialize-javascript';

import fetchWrapper from 'model/fetchWrapper';
import xhrWrapper from 'model/xhrWrapper';
import driftWindow from 'model/driftWindow';

import showAlert from 'lib/showAlert';
import toggleFullPageLoader from 'lib/toggleFullPageLoader';
import showUploadProgress from 'lib/showUploadProgress';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';

function enableUpload() {
	$('#inputUpload').attr('disabled', false);
}

function disableUpload() {
	$('#inputUpload').attr('disabled', 'disabled');
}

function showButtonStartTraining() {
	$('#buttonStartTraining').removeClass('d-none').addClass('fadeIn animated');
}

function hideButtonStartTraining() {
	$('#buttonStartTraining').addClass('d-none').removeClass('fadeIn animated');
}

function createRetrieveResult(data) {
	let html = '<div class="col-sm-12"><h3>請輸入您要訓練的人臉名稱，輸入完成後按下開始訓練</h3></div>';
	_forIn(data, (value, key) => {
		html += `<div class="col-lg-2 col-md-3 col-6">
							<div class="faceList__item" data-key="${key}">
								<div class="faceList__face">
									<div class="faceList__img">
										<img src="${S3IMAGEPATH}/face/retrieve/${key}" alt=""/>
									</div>
								</div>
								<div class="input__hoverBox">
									<input type="text" class="input__hover"/>
									<div class="fa fa-pencil"></div>
									<div class="input__hoverLine"></div>
								</div>
							</div>
						</div>`;
	});
	$('#trainResult').html(html);
	$('.input__hover').first().focus();
}

function trainFace() {
	const json = [];
	$('.faceList__item').each(function eachItem() {
		const $input = $(this).find('.input__hover');
		if ($input.val() !== '') {
			json.push({
				faceImageID: $(this).data('key'),
				name: $input.val(),
			});
		}
	});
	if (json.length === 0) {
		showAlert('請至少輸入一個人名', 'danger');
	} else {
		fetchWrapper({
			url: fetchs.train.url,
			options: {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json; charset=utf-8',
				}),
				body: serialize({
					json: JSON.stringify(json),
				}),
			},
			timeout: 1000000,
			beforeFetch: () => {
				toggleFullPageLoader();
			},
			fetchSuccess: () => {
				$('#trainResult').empty();
			},
			afterFetch: (response) => {
				toggleFullPageLoader();
				hideButtonStartTraining();
				enableUpload();
				statusAlert(fetchs.train.alerts, response.status);
			},
		});
	}
}

function retrieveFace(fileNames) {
	return fetchWrapper({
		url: fetchs.retrieve.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: serialize({
				json: JSON.stringify(fileNames),
			}),
		},
		timeout: 1000000,
		beforeFetch: () => {
			toggleFullPageLoader();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				response.json().then((body) => {
					createRetrieveResult(body);
				});
				showButtonStartTraining();
				disableUpload();
			}
		},
		afterFetch: (response) => {
			toggleFullPageLoader();
			statusAlert(fetchs.retrieve.alerts, response.status);
		},
	});
}

function uploadPhoto(files) {
	const $inputUpload = $('#inputUpload');
	const uploadDriftWindow = driftWindow('#uploadDriftWindow');
	const formdata = new FormData();
	for (let i = 0; i < files.length; i += 1) {
		formdata.append(`files[${i}]`, files[i]);
	}
	return xhrWrapper({
		url: fetchs.uploadPhoto.url,
		options: {
			method: 'POST',
			body: formdata,
		},
		timeout: 1000000,
		beforeFetch: () => {
			$(window).on('beforeunload', () => false);
			$inputUpload.attr('disabled', 'disabled');
			uploadDriftWindow.show();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				retrieveFace(JSON.parse(response.response));
			}
		},
		afterFetch: (response) => {
			$(window).off('beforeunload');
			$inputUpload.attr('disabled', false);
			uploadDriftWindow.hide();
			$('#inputUpload')[0].value = '';
			statusAlert(fetchs.uploadPhoto.alerts, response.status);
		},
		onProgress: showUploadProgress,
	});
}

function initFaceListFace() {
	$(document).on('click', '.faceList__face', function onFaceListFaceClick() {
		$(this).parent().find('.input__hover').focus();
	});
}

export default function train() {
	$('#inputUpload').on('change', function onInputUploadChange() {
		const Files = this.files;
		const fileArray = [];
		if (Files.length > 10) {
			showAlert('照片不得超過10張', 'danger');
			return;
		}
		for (let i = 0; i < Files.length; i += 1) {
			const file = Files[i];
			if (file.type === 'image/jpeg' || file.type === 'image/png') {
				fileArray.push(file);
			} else {
				showAlert('照片格式錯誤，接受格式為jpg、png', 'danger');
				return;
			}
		}
		uploadPhoto(fileArray);
	});

	$('#buttonStartTraining').on('click', trainFace);
	initFaceListFace();
}
