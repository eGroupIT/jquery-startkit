import { Base64 } from 'js-base64';

import fetchWrapper from 'model/fetchWrapper';
import validator from 'model/validator';

import toggleFullPageLoader from 'lib/toggleFullPageLoader';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';
import getCookieByName from 'lib/getCookieByName';

function applyTrial() {
	return fetchWrapper({
		url: fetchs.applyTrial.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				jobTitle: $('#inputJobTitle').val(),
				jobRole: $('#selectJobRole').val(),
				phone: $('#inputPhoneNumber').val(),
				companyType: $('#selectCompanyType').val(),
				caseDescription: $('#textAreaCaseDescription').val(),
				caseScale: $('#inputCaseScale').val(),
				isServiceExp: $('.jsRadioIsServiceExp:checked').val(),
				serviceUsed: $('#inputServiceUsed:enabled').val(),
			}),
		},
		beforeFetch: () => {
			toggleFullPageLoader();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) $('.container-fluid').html('<h3>申請中，我們將於２４小時內回覆請稍後...</h3>');
		},
		afterFetch: (response) => {
			toggleFullPageLoader();
			statusAlert(fetchs.applyTrial.alerts, response.status);
		},
	});
}

export default function download() {
	const mInfo = JSON.parse(Base64.decode(getCookieByName('m_info')));
	if (!mInfo.applyStatus) {
		const vail = validator({
			form: '#formDownload',
			fields: [{
				names: ['jobTitle', 'jobRole', 'companyType', 'caseDescription', 'serviceUsed'],
				isRequired: {
					message: '不能為空',
				},
			}, {
				names: ['phoneNumber', 'caseScale'],
				isNumber: {
					messages: {
						phoneNumber: '請輸入數字不需要-或空格ex:0212345678',
						caseScale: '請輸入數字',
					},
				},
			}],
		}, applyTrial);

		const $inputServiceUsed = $('#inputServiceUsed');
		$('.jsRadioIsServiceExp').on('change', function onRSEchange() {
			console.log(this.value);
			if (this.value === 'false') {
				$inputServiceUsed.attr('disabled', 'disabled');
				$inputServiceUsed.removeClass('is-invalid');
			} else {
				$inputServiceUsed.attr('disabled', false);
			}
			vail.setElms();
		});
	} else if (mInfo.applyStatus === 'pending') {
		$('.container-fluid').html('<h3>申請中，我們將於２４小時內回覆請稍後...</h3>');
	} else if (mInfo.applyStatus === 'approved') {
		$('.container-fluid').html('<h3>申請完成，請至email收取下載連結</h3>');
	} else if (mInfo.applyStatus === 'failed') {
		$('.container-fluid').html('<h3>審核未通過，請email與我們聯絡</h3><p>聯絡人 : 林宏恩</p><p>email : egroup.daniel@gmail.com</p>');
	}
}
