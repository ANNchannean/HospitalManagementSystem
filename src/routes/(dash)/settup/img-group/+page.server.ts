import { db } from '$lib/server/db';
import { imagerieGroup } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
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
				console.log(e);
				return fail(500, { serverError: true });
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
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_imagerie_group: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(imagerieGroup)
			.where(eq(imagerieGroup.id, Number(id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
