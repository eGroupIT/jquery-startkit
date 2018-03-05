import Validator from 'class/Validator';

export default function factory(cusSettings, afterCheck) {
	const validator = new Validator(cusSettings, afterCheck);
	validator.init();
	return validator;
}
