function getUrlVars(url) {
	const vars = {};
	const hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (let i = 0; i < hashes.length; i += 1) {
		const hash = hashes[i].split('=');
		vars[hash[0]] = hash[1];
	}
	return vars;
}

export default function getUrlVar(name, url = window.location.href) {
	return getUrlVars(url)[name];
}
