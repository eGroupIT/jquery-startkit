import fetchWrapper from 'model/fetchWrapper';

import toggleFullPageLoader from 'lib/toggleFullPageLoader';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';
import facebookgraphapi from 'lib/facebookgraphapi';

function checkLogin() {
	return fetchWrapper({
		url: fetchs.checkLogin.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				account: $('#inputEmail').val(),
				password: $('#inputPassword').val(),
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
			statusAlert(fetchs.checkLogin.alerts, response.status);
		},
	});
}

export default function login() {
	$('#formLogin').on('submit', (e) => {
		e.preventDefault();
		checkLogin();
	});
	facebookgraphapi();
}
