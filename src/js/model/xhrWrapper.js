import XhrWrapper from 'class/XhrWrapper';

export default function factory(cusSettings) {
	const xhrWrapper = new XhrWrapper(cusSettings);
	return xhrWrapper.start();
}
