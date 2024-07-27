import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.session) {
		redirect(302, '/login');
	}
	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	redirect(302, '/login');
};
