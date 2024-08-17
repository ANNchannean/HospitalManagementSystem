import { db } from '$lib/server/db';
import { progressNote, room, visit } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	await parent();
	const get_pregress_notes = await db.query.progressNote.findMany({
		with: {
			patient: true,
			room: {
				with: {
					product: true
				}
			},
			staff: true,
			department:true
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
	const get_departments = await db.query.department.findMany();
	const get_staffs = await db.query.staff.findMany();
	const get_form_documents = await db.query.formDocument.findMany();
	return {
		get_visits,
		get_pregress_notes,
		get_departments,
		get_staffs,
		get_form_documents
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
	},
	update_etiology: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const etiology = body.get('etiology') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(progressNote)
			.set({
				etiology: etiology.toString()
			})
			.where(eq(progressNote.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_department: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const department_id = body.get('department_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(progressNote)
			.set({
				department_id: +department_id
			})
			.where(eq(progressNote.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_staff: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const staff_id = body.get('staff_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(progressNote)
			.set({
				staff_id: +staff_id
			})
			.where(eq(progressNote.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
