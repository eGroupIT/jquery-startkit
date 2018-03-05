import fetchWrapper from 'model/fetchWrapper';
import validator from 'model/validator';

import toggleFullPageLoader from 'lib/toggleFullPageLoader';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';

function resetPassword() {
	return fetchWrapper({
		url: fetchs.resetPassword.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				password: $('#inputOldPassword').val(),
				newPassword: $('#inputNewPassword').val(),
			}),
		},
		beforeFetch: () => {
			toggleFullPageLoader();
		},
		fetchSuccess: () => {
			window.open('/dashboard/', '_self');
		},
		afterFetch: (response) => {
			toggleFullPageLoader();
			statusAlert(fetchs.resetPassword.alerts, response.status);
		},
	});
}

export default function resetpassword() {
	validator({
		form: '#formResetPassword',
		fields: [{
			names: ['oldpassword'],
			isRequired: {
				message: '不能為空',
			},
		}, {
			name: 'newpassword',
			isEquals: {
				message: '檢查不相同',
				selector: '#inputConfirmNewPassword',
			},
		}],
	}, resetPassword);
}
