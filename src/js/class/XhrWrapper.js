import _forIn from 'lodash/forIn';
import FetchWrapper from './FetchWrapper';

function createXhr(url, opts = {}, onProgress) {
	let startTime;
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(opts.method, url);
		if (opts.headers) {
			_forIn(opts.headers, (value, key) => {
				xhr.setRequestHeader(key, value);
			});
		}
		if (xhr.upload && onProgress) {
			xhr.upload.onloadstart = () => {
				startTime = new Date().getTime();
			};
			xhr.upload.onprogress = (event) => {
				onProgress(event, startTime);
			};
		}
		xhr.onload = (e) => {
			try {
				resolve(e.target);
			} catch (error) {
				reject(error);
			}
		};
		xhr.onerror = reject;
		xhr.send(opts.body);
	});
}

export default class XhrWrapper extends FetchWrapper {
	_createFetch() {
		return createXhr(this.sets.url, this.sets.options, this.sets.onProgress);
	}
}
