import Store from 'class/Store';

export default function factory(initState) {
	return new Store(initState);
}
