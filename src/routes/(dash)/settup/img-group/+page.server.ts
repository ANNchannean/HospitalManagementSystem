import { db } from '$lib/server/db';
import { imagerieGroup } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async () => {
	const get_imagerie_groups = await db.query.imagerieGroup.findMany({});
	return {
		get_imagerie_groups
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_imagerie_group: async ({ request }) => {
		const body = await request.formData();
		const { imagerie_group } = Object.fromEntries(body) as Record<string, string>;
		if (!imagerie_group.trim()) return fail(400, { imagerie_group: true });
		await db
			.insert(imagerieGroup)
			.values({
				imagerie_group: imagerie_group
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_imagerie_group: async ({ request }) => {
		const body = await request.formData();
		const { imagerie_group, imagerie_group_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		if (!imagerie_group.trim() || isNaN(+imagerie_group_id))
			return fail(400, { imagerie_group: true });
		await db
			.update(imagerieGroup)
			.set({
				imagerie_group: imagerie_group
			})
			.where(eq(imagerieGroup.id, Number(imagerie_group_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_imagerie_group: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(imagerieGroup)
			.where(eq(imagerieGroup.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
