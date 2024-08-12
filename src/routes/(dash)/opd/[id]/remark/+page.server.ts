import { db } from '$lib/server/db';
import { remark } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async ({ params }) => {
	const visit_id = parseInt(params.id);
	const get_remark = await db.query.remark.findFirst({
		where: eq(remark.visit_id, visit_id)
	});
	return {
		get_remark
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_remark: async ({ request, params }) => {
		const visit_id = parseInt(params.id);
		const body = await request.formData();
		const { description } = Object.fromEntries(body) as Record<string, string>;
		const get_remark = await db.query.remark.findFirst({
			where: eq(remark.visit_id, visit_id)
		});
		if (!get_remark) {
			await db
				.insert(remark)
				.values({
					description: description,
					visit_id: visit_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (get_remark) {
			await db
				.update(remark)
				.set({
					description: description
				})
				.where(eq(remark.visit_id, visit_id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		redirect(303, '?');
	},
	delete_remark: async ({ request }) => {
		const id = (await request.formData()).get('id');
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		await db
			.delete(remark)
			.where(eq(remark.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
