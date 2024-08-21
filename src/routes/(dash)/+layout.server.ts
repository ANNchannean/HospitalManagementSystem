import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { isNull } from 'drizzle-orm';
import { progressNote } from '$lib/server/schema';
// import { redirect } from '@sveltejs/kit';
// export const prerender = true;
// export const ssr = false;
export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	// if (!locals.session) redirect(302, '/login');
	// if (locals?.user?.role === 'DOCTOR') redirect(302, '/dashboard');
	const lang = cookies.get('lang');
	const get_clinich_info = await db.query.clinicinfo.findFirst({ with: { fileOrPicture: true } });
	const get_progress_note = await db.query.progressNote.findMany({
		where: isNull(progressNote.date_checkout),
		with: {
			patient: true
		}
	});
	const get_wards = await db.query.ward.findMany({
		with: {
			room: {
				with: {
					product: true,
					bed: true
				}
			}
		}
	});
	return {
		user: locals.user,
		lang: lang,
		get_clinich_info: get_clinich_info,
		get_progress_note,
		get_wards
	};
};
