import 'isomorphic-fetch';
import 'babel-polyfill';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'vendor/bootstrap-slider';
import sbadmin from 'vendor/sb-admin';

import dashboard from './dashboard';
import recognize from './recognize';
import login from './login';
import logout from './logout';
import train from './train';
import model from './model';
import download from './download';
import resetpassword from './resetpassword';

import '../scss/dashboard';

if (module.hot) module.hot.accept();

window.onload = () => {
	sbadmin();
	const sPath = window.location.pathname;
	const pageName = sPath.substring(sPath.lastIndexOf('/') + 1).replace('.html', '');
	switch (pageName) {
		case '':
		case 'dashboard':
			dashboard();
			break;
		case 'train':
			train();
			break;
		case 'model':
			model();
			break;
		case 'login':
			login();
			break;
		case 'logout':
			logout();
			break;
		case 'recognize':
			recognize();
			break;
		case 'download':
			download();
			break;
		case 'resetpassword':
			resetpassword();
			break;
		default:
			break;
	}
};
