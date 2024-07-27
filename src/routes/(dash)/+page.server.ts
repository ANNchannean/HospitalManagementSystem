import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load = (async ({ cookies }) => {
	redirect(303, '/dashboard');
	const lang = cookies.get('lang') ?? 'ko';
	return { lang };
}) satisfies PageServerLoad;

export const actions: Actions = {
	lang_en: async ({ cookies, request }) => {
		const body = await request.formData();
		cookies.set('lang', `en`, { path: '/', secure: !dev, sameSite: 'strict' });
	},
	lang_ko: async ({ cookies, request }) => {
		const body = await request.formData();
		cookies.set('lang', `ko`, { path: '/', secure: !dev, sameSite: 'strict' });
	}
};
