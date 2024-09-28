import { lucia } from '$lib/server/auth/lucia';
import { type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { sequence } from '@sveltejs/kit/hooks';
// import { redis } from '$lib/server/redis';
const handleAuth = (async ({ event, resolve }) => {
	// @ Auth Lucaia
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
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
	const lang = event.cookies.get('lang') ?? '';
	const langa = event.request.headers.get('accept-language')?.split(',')[0];
	if (langa) {
		locale.set(langa);
	}
	event.locals.user = user;
	event.locals.session = session;
	event.locals.lang = lang;
	// @ Language Emplement
	// redisCatch();
	return resolve(event);
}) satisfies Handle;
const handleLanguage = (async ({ event, resolve }) => {
	const lang = event.cookies.get('lang') ?? '';
	const langa = event.request.headers.get('accept-language')?.split(',')[0];
	if (langa) {
		locale.set(langa);
	}

	event.locals.lang = lang;

	return resolve(event);
}) satisfies Handle;

export const handle = sequence(handleAuth, handleLanguage);
