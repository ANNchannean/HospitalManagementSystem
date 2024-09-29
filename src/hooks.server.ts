import { lucia } from '$lib/server/auth/lucia';
import { type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { sequence } from '@sveltejs/kit/hooks';
const handleLuciaAuth = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}) satisfies Handle;
const handleLanguage = (async ({ event, resolve }) => {
	const lang = event.cookies.get('lang') ?? '';
	const langu = event.request.headers.get('accept-language')?.split(',')[0];
	if (langu) {
		locale.set(langu);
	}
	event.locals.lang = lang;
	return resolve(event);
}) satisfies Handle;

export const handle = sequence(handleLuciaAuth, handleLanguage);
