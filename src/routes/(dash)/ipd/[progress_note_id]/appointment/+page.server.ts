import { db } from '$lib/server/db';
import { appointment } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';


export const load = (async ({ params }) => {
	const { progress_note_id } = params;
	const get_appointment = await db.query.appointment.findFirst({
		where: eq(appointment.progress_note_id, +progress_note_id)
	});
	return {
		get_appointment
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_appointment: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const { date, description } = Object.fromEntries(body) as Record<string, string>;
		const get_appointment = await db.query.appointment.findFirst({
			where: eq(appointment.progress_note_id, +progress_note_id)
		});
		if (!get_appointment) {
			await db
				.insert(appointment)
				.values({
					date: date,
					description: description,
					progress_note_id: +progress_note_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (get_appointment) {
			await db
				.update(appointment)
				.set({
					date: date,
					description: description
				})
				.where(eq(appointment.progress_note_id, +progress_note_id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		redirect(303, '?');
	},
	delete_appointment: async ({ request }) => {
		const id = (await request.formData()).get('id');
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		await db
			.delete(appointment)
			.where(eq(appointment.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
