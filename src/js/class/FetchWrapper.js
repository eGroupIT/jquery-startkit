import _mergeWith from 'lodash/mergeWith';

export default class FetchWrapper {
	constructor(cusSettings) {
		this.sets = _mergeWith({
			callerFunction: () => {},
			name: 'anonymous',
			description: 'none',
			url: '',
			options: {
				credentials: 'same-origin',
				method: 'GET',
				body: {},
			},
			beforeFetch: () => {},
			fetchSuccess: (response) => {
				console.log('fetchSuccess');
				console.log(response);
			},
			fetchFailure: (response) => {
				console.log('fetchFailure');
				console.log(response);
			},
			afterFetch: (response) => {
				console.log('afterFetch');
				console.log(response);
			},
			handleCatch: (error) => {
				console.log(error);
			},
			timeout: 10000,
		}, cusSettings);
	}

	start() {
		this.sets.beforeFetch();
		const p = Promise.race([
			this._createFetch(),
			new Promise((resolve, reject) => {
				setTimeout(() => {
					reject(new Error('request timeout'));
				}, this.sets.timeout);
			}),
		]);
		return p.then((response) => {
			this._showFetchInfo();
			if (response.status >= 200 && response.status < 300) {
				this.sets.fetchSuccess(response);
			} else {
				this.sets.fetchFailure(response);
			}
			this.sets.afterFetch(response);
			return response;
		}).catch((error) => {
			this.sets.handleCatch(error);
		});
	}

	_createFetch() {
		return fetch(this.sets.url, this.sets.options);
	}

	_showFetchInfo() {
		console.log(`%cFunction Name: ${this.sets.name}`, 'background: #222; color: #bada55');
		console.log(`%cDescription: ${this.sets.description}`, 'background: #1d8adb; color: #fff');
		console.log(`Fetch Url ${this.sets.url}`);
		console.log(`Fetch Method ${this.sets.options.method}`);
		console.log('Fetch body');
		console.log(this.sets.options.body);
	}
}
