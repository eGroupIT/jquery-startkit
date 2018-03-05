import _forEach from 'lodash/forEach';

import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';
import equals from 'validator/lib/equals';
// import isMobilePhone from 'validator/lib/isMobilePhone';
// import isByteLength from 'validator/lib/isByteLength';

import fetchWrapper from 'model/fetchWrapper';

export default class Validator {
	constructor(cusSettings, afterCheck) {
		this.form = cusSettings.form;
		this.fields = cusSettings.fields;

		this.afterCheck = afterCheck;

		this._checkRemote = this._checkRemote.bind(this);
	}

	/**
	 * init settings
	 */
	init() {
		if (!this.form) {
			console.warn('valid need form');
			return;
		}
		this.$form = $(this.form);
		this.setElms(this._createInvalidFeedback);

		this.$form.on('submit', async (e) => {
			e.preventDefault();
			await this.check();
			if (this.pass) {
				$('.is-invalid').removeClass('is-invalid');
				$('.is-valid').removeClass('is-valid');
				this.afterCheck();
			}
		});
	}

	/**
	 * check all inputs pass
	 */
	async check() {
		this.pass = true;
		const remotes = [];
		_forEach(this.fields, (field, index) => {
			_forEach(this.formElms[index], ($elm) => {
				const vaildTypes = ['isRequired', 'isEmail', 'isEquals', 'isNumber'];
				for (let i = 0; i < vaildTypes.length; i += 1) {
					const type = vaildTypes[i];
					const funcName = `_${type}Check`;
					if (field[type]) {
						if (!this[funcName]($elm, field[type])) {
							this._showError($elm, field[type].message || field[type].messages[$elm.attr('name')]);
							this.pass = false;
							return;
						}
						this._hideError($elm);
					}
				}
				// if (!this._checkIsMobilePhone(field, $elm)) pass = false;
				// if (!this._checkIsByteLength(field, $elm)) pass = false;
				if (field.remote) {
					remotes.push({
						field,
						$elm,
					});
				}
			});
		});

		if (remotes.length > 0) {
			const promises = [];
			_forEach(remotes, (obj) => {
				promises.push(this._checkRemote(obj.field.remote(), obj.$elm));
			});
			await Promise.all(promises);
		}
		return this.pass;
	}

	/**
	 * set elms into this.fields
	 * @param {*} field
	 */
	setElms(cb) {
		this.formElms = [];
		_forEach(this.fields, (field, index) => {
			const elms = [];
			if (field.name) {
				const $elm = this._selectJqueryElm(field.name);
				if ($elm) {
					elms.push($elm);
					if (cb) cb($elm);
				}
				this.formElms[index] = elms;
			} else if (field.names) {
				_forEach(field.names, (name) => {
					const $elm = this._selectJqueryElm(name);
					if ($elm) {
						elms.push($elm);
						if (cb) cb($elm);
					}
				});
				this.formElms[index] = elms;
			} else console.warn('field object need name or names attribute');
		});
	}

	_selectJqueryElm(name) {
		const $input = this.$form.find(`input[name="${name}"]:enabled`);
		if ($input.length === 1) return $input;
		else if ($input.length > 1) console.warn('find multiple input has same names');

		const $select = this.$form.find(`select[name="${name}"]:enabled`);
		if ($select.length === 1) return $select;
		else if ($select.length > 1) console.warn('find multiple select has same names');

		const $textarea = this.$form.find(`textarea[name="${name}"]:enabled`);
		if ($textarea.length === 1) return $textarea;
		else if ($textarea.length > 1) console.warn('find multiple textarea has same names');

		return false;
	}

	_createInvalidFeedback = ($elm) => {
		const $formGroup = $elm.parents('.form-group');
		if ($formGroup.find('.invalid-feedback').length === 0) $formGroup.append(`<div class="invalid-feedback"></div>`);
	}

	/**
	 * show valid error
	 */
	_showError = ($elm, message) => {
		$elm.removeClass('is-valid').addClass('is-invalid');
		$elm.parents('.form-group').find('.invalid-feedback').text(message);
	}

	/**
	 * hide valid error
	 */
	_hideError = ($elm) => {
		$elm.removeClass('is-invalid').addClass('is-valid');
	}

	/**
	 * use $elm's value to check Is Required
	 */
	_isRequiredCheck = ($elm) => {
		if ($elm.val()) return !isEmpty($elm.val());
		return false;
	}

	/**
	 * use $elm's value to check Is Email
	 */
	_isEmailCheck = $elm => isEmail($elm.val())

	/**
	 * use $elm's value to check Is Email
	 */
	_isEqualsCheck = ($elm, isEquals) => equals($elm.val(), $(isEquals.selector).val());

	/**
	 * use $elm's value to check Is Number
	 */
	_isNumberCheck = $elm => isNumeric($elm.val());

	/**
	 * wrapper cus fetchwrapper to check remote
	 */
	_checkRemote = (remote, $elm) => fetchWrapper({
		url: remote.url,
		options: remote.options,
		beforeFetch: () => {
			remote.beforeFetch();
		},
		fetchSuccess: (response) => {
			remote.fetchSuccess(response, () => {
				this._hideError($elm);
			});
		},
		fetchFailure: (response) => {
			this.pass = false;
			remote.fetchFailure(response, () => {
				this._showError($elm, remote.message);
			});
		},
		afterFetch: (response) => {
			remote.afterFetch(response, () => {
				this._showError($elm, remote.message);
			}, () => {
				this._hideError($elm);
			}, () => {
				this.pass = false;
			});
		},
		handleCatch: (error) => {
			remote.handleCatch(error);
		},
		timeout: remote.timeout,
	})
}

/**
 * sample customer config
 */
// const sample = {
// 	form: '#formUikitValid',
// 	fields: [{
// 		names: ['firstName', 'lastName'],
// 		isRequired: {
// 			message: '不能為空',
// 		},
// 	}, {
// 		name: 'account',
// 		isRequired: {
// 			message: '不能為空',
// 		},
// 		isEmail: {
// 			message: '格式不正確',
// 		},
// 		remote() {
// 			return ({
// 				message: 'email已被註冊',
// 				url,
// 				options: {
// 					method: 'POST',
// 					headers: new Headers({
// 						'Content-Type': 'application/json; charset=utf-8',
// 					}),
// 					body: JSON.stringify({
// 						email: $('#inputContactEmail').val(),
// 					}),
// 				},
// 				beforeFetch: () => {
// 				},
// 				fetchSuccess: (response, hideError) => {
// 					hideError();
// 				},
// 				fetchFailure: (response, showError) => {
// 					showError();
// 				},
// 				afterFetch: (response, showError, hideError, notPass) => {
// 					if (response.status === 298) {
// 						hideError();
// 					} else {
// 						showError();
// 						notPass();
// 					}
// 				},
// 			});
// 		},
// 	}, {
// 		name: 'mobilePhone',
// 		isMobilePhone: {
// 			message: '格式不正確',
// 			locale: 'zh-TW',
// 		},
// 	}, {
// 		name: 'password',
// 		isRequired: {
// 			message: '不能為空',
// 		},
// 		isEquals: {
// 			message: '檢查不相同',
// 			selector: '#inputValidCheckPassword',
// 		},
// 	}, {
// 		name: 'code',
// 		isByteLength: {
// 			message: '長度錯誤',
// 			option: {
// 				min: 2,
// 				max: 8,
// 			},
// 		},
// 	}],
// };
