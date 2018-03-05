import _forEach from 'lodash/forEach';

import toggleFullPageLoader from 'lib/toggleFullPageLoader';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';

import persistedFaceList from 'apis/persistedFaceList';

function renderTrainedModel(data) {
	let html = '';
	_forEach(data, (value, index) => {
		html += `<div class="col-lg-2 col-md-3 col-4">
							<div class="faceList__item">
								<div class="faceList__face">
									<div class="faceList__img">
										<img src="${S3IMAGEPATH}/face/train/${value.persistedFacePath}" alt=""/>
									</div>
								</div>
								<div class="input__hoverBox">
									<input type="text" class="input__hover" value="${value.persistedFaceName}" disabled/>
								</div>
							</div>
						</div>`;
	});
	$('#trainedModel').html(html);
}

export default function model() {
	persistedFaceList({
		beforeFetch: () => {
			toggleFullPageLoader();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				response.json().then((body) => {
					renderTrainedModel(body);
				});
			}
		},
		afterFetch: (response) => {
			toggleFullPageLoader();
			statusAlert(fetchs.persistedFaceList.alerts, response.status);
		},
	});
}
