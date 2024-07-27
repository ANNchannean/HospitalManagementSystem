import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { visit } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
export const load: LayoutServerLoad = async ({ params }) => {
	const visit_id = params.id;
	if (isNaN(+visit_id)) redirect(303, '/patient/all');
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id)),
		with: {
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			},
			department: true,
			staff: true,
			progressNote: true
		}
	});

	if (!get_visit) redirect(303, '/patient/all');
	return {
		get_visit
	};
};
