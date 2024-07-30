import { db } from '$lib/server/db';
import { visit } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	await parent();
	const get_pregress_notes = await db.query.progressNote.findMany({
		with: {
			patient: true,
			visit: {
				with: {
					staff: true,
					patient: true,
					department: true
				}
			}
		},
		orderBy: desc(visit.date_checkup)
	});
	const get_visits = await db.query.visit.findMany({
		where: eq(visit.checkin_type, 'IPD'),
		with: {
			staff: true,
			patient: true,
			department: true
		},
		orderBy: desc(visit.date_checkup)
	});
	return {
		get_visits,
		get_pregress_notes
	};
}) satisfies PageServerLoad;

export const actions: Actions = {};
