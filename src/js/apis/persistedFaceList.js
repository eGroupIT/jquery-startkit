import fetchWrapper from 'model/fetchWrapper';
import fetchs from 'lib/fetchs';

export default function persistedFaceList(funcs) {
	return fetchWrapper({
		url: fetchs.persistedFaceList.url,
		options: {
			method: 'GET',
		},
		beforeFetch: funcs.beforeFetch,
		fetchSuccess: funcs.fetchSuccess,
		afterFetch: funcs.afterFetch,
	});
}
