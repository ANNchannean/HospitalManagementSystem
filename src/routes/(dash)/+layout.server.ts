import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
// export const prerender = true;
// export const ssr = false;
export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	// if (!locals.session) redirect(302, '/login');
	// if (locals?.user?.role === 'DOCTOR') redirect(302, '/dashboard');
	const lang = cookies.get('lang');
	const get_clinich_info = await db.query.clinicinfo.findFirst({ with: { fileOrPicture: true } });
	return {
		user: locals.user,
		lang: lang,
		get_clinich_info: get_clinich_info
	};
};
