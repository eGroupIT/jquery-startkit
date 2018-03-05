import _forIn from 'lodash/forIn';
import showAlert from './showAlert';

export default function statusAlert(alerts, status) {
	if (!alerts) return;
	const defaultAlert = alerts.default;
	let showMessage = false;
	_forIn(alerts, (value, key) => {
		if (status === parseInt(key, 10) && value.message) {
			showAlert(value.message, value.type, value.options);
			showMessage = true;
		}
	});
	if (status !== 200 && !showMessage && defaultAlert && defaultAlert.message) {
		showAlert(defaultAlert.message, defaultAlert.type, defaultAlert.options);
	}
}
