import { db } from '$lib/server/db';
import { laboratoryGroup } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async () => {
	const get_lab_groups = await db.query.laboratoryGroup.findMany({});
	return {
		get_lab_groups
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_lab_group: async ({ request }) => {
		const body = await request.formData();
		const { lab_group } = Object.fromEntries(body) as Record<string, string>;
		if (!lab_group.trim()) return fail(400, { lab_group: true });
		await db
			.insert(laboratoryGroup)
			.values({
				laboratory_group: lab_group
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_lab_group: async ({ request }) => {
		const body = await request.formData();
		const { lab_group, lab_group_id } = Object.fromEntries(body) as Record<string, string>;
		if (!lab_group.trim() || isNaN(+lab_group_id)) return fail(400, { lab_group: true });
		await db
			.update(laboratoryGroup)
			.set({
				laboratory_group: lab_group
			})
			.where(eq(laboratoryGroup.id, Number(lab_group_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_lab_group: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(laboratoryGroup)
			.where(eq(laboratoryGroup.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
