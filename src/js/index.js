import 'isomorphic-fetch';
import 'babel-polyfill';

import 'bootstrap/dist/js/bootstrap.bundle.min';

// import 'vendor/owl.carousel.min';
import landingPage from './landingPage';

import '../scss/landingPage';

if (module.hot) module.hot.accept();

window.onload = () => {
	const sPath = window.location.pathname;
	const pageName = sPath.substring(sPath.lastIndexOf('/') + 1).replace('.html', '');
	switch (pageName) {
		case '':
		case 'index':
			landingPage();
			break;
		case 'uikit':
		case 'uikit.html':
			if (process.env.NODE_ENV !== 'production') {
				require('./vendor/now-ui-kit')();
			}
			break;
		default:
			break;
	}
};
