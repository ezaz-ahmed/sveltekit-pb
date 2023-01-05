import Pocketbase from 'pocketbase';
import { serializedNonPojo } from './lib/utils';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new Pocketbase('http://127.0.0.1:8090');
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializedNonPojo(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			secure: false
		})
	);

	return response;
};
