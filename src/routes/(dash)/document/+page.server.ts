import { db } from '$lib/server/db';
import { formDocument } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ parent }) => {
	await parent();
	const get_form_document = await db.query.formDocument.findMany({
		orderBy: desc(formDocument.id)
	});
	const get_patients = await db.query.patient.findMany({});
	return {
		get_form_document,
		get_patients
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_document: async ({ request }) => {
		const body = await request.formData();
		const { title, content, id } = Object.fromEntries(body) as Record<string, string>;
		if (+id !== 0) {
			await db
				.update(formDocument)
				.set({
					content: content,
					title: title,
					datetime: now_datetime()
				})
				.where(eq(formDocument.id, +id))
				.catch((e) => {
					logErrorMessage(e);
				});
		} else {
			await db
				.insert(formDocument)
				.values({
					content: content,
					title: title,
					datetime: now_datetime()
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	},
	delete_document: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		if (isNaN(+id)) return fail(400, { id: true });
		if (id) {
			await db
				.delete(formDocument)
				.where(eq(formDocument.id, +id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
