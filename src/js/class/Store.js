import _mergeWith from 'lodash/mergeWith';

export default class Store {
	constructor(initState) {
		this.store = initState || {};
	}

	set(name, value) {
		const obj = {};
		obj[name] = value;
		this.store = _mergeWith(this.store, obj);
	}

	get(name) {
		if (name) return this.store[name];
		return this.store;
	}

	delete(name) {
		delete this.store[name];
	}
}
