import { db } from '$lib/server/db';
import { vaccineType } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_vaccin_types = await db.query.vaccineType.findMany({});
	return {
		get_vaccin_types
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_vaccine_type: async ({ request }) => {
		const body = await request.formData();
		const { type } = Object.fromEntries(body) as Record<string, string>;
		if (!type.trim()) return fail(400, { type: true });
		await db
			.insert(vaccineType)
			.values({
				type: type
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_vaccine_type: async ({ request }) => {
		const body = await request.formData();
		const { vaccine_type_id, type } = Object.fromEntries(body) as Record<string, string>;
		if (!type.trim() || isNaN(+vaccine_type_id)) return fail(400, { type: true });
		await db
			.update(vaccineType)
			.set({
				type: type
			})
			.where(eq(vaccineType.id, Number(vaccine_type_id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_vaccine_type: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(vaccineType)
			.where(eq(vaccineType.id, Number(id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
