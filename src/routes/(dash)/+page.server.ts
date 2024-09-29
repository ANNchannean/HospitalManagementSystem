import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load = (async ({ cookies }) => {
	redirect(303, '/dashboard');
	const lang = cookies.get('lang') ?? 'km';
	return { lang };
}) satisfies PageServerLoad;

export const actions: Actions = {
	lang_en: async ({ cookies }) => {
		cookies.set('lang', `en`, { path: '/', secure: !dev, sameSite: 'strict' });
	},
	lang_km: async ({ cookies }) => {
		cookies.set('lang', `km`, { path: '/', secure: !dev, sameSite: 'strict' });
	}
};
