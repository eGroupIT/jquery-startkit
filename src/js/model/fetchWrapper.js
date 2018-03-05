import FetchWrapper from 'class/FetchWrapper';

export default function factory(cusSettings) {
	const fetchWrapper = new FetchWrapper(cusSettings);
	return fetchWrapper.start();
}
