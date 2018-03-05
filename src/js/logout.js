import fetchWrapper from 'model/fetchWrapper';

export default function logout() {
	return fetchWrapper({
		url: '/rest/member/logout',
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
		},
		fetchSuccess: () => {
			window.open('/', '_self');
		},
	});
}
