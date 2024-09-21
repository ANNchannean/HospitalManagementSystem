import { lucia } from '$lib/server/auth/lucia';
import { type Handle } from '@sveltejs/kit';
// import { redis } from '$lib/server/redis';
export const handle: Handle = async ({ event, resolve }) => {
	// @ Redis Catch
	/*
	async function redisCatch() {
		const { url } = event;
		const key = `rendered:v1:${url.pathname}`;
		let cached = await redis.hGetAll(key);
		if (!cached.body) {
			
			const response = await resolve(event);

			// then convert it into a cachable object
			cached = Object.fromEntries(response.headers.entries());
			cached.body = await response.text();

			if (response.status === 200) {
				
				redis.hSet(key, cached);
			}
		}
		const { body, ...headers } = cached;
		return new Response(body, { headers: new Headers(headers) });
	}
*/
	// @ Auth Lucaia
	const lang = event.cookies.get('lang') ?? '';
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
	event.locals.user = user;
	event.locals.session = session;
	event.locals.lang = lang;
	// @ Language Emplement
	// redisCatch();
	return resolve(event);
};
