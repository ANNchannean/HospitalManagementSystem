import { db } from '$lib/server/db';
import { progressNote, room, visit } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
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
			},
			room: {
				with:{
					product:true
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

export const actions: Actions = {
	delete_progress_note: async ({ request }) => {
		const body = (await request.formData()).entries();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		const getProgressNote = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +id)
		});
		await db.update(room).set({ status: false }).where(eq(room.id, getProgressNote!.room_id!));
		await db
			.delete(progressNote)
			.where(eq(progressNote.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
