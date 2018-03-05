export default function facebookgraphapi() {
	$.post('https://graph.facebook.com', {
		id: window.location.toString(),
		scrape: true,
	}, (response) => {
		console.log(response);
	});
}
