import { lucia } from '$lib/server/auth/lucia';
import { getSession } from '$lib/server/auth/session';
import { type Handle } from '@sveltejs/kit';
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
const handleAuth = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');
	if (sessionId) {
		const user = getSession(sessionId);
		if (user) {
			event.locals.user = user;
		}
	}
	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(handleLuciaAuth, handleAuth);
