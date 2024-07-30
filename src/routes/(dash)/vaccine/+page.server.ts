import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({parent}) => {
	await parent()
	const get_vaccins = await db.query.vaccine.findMany({});
	const get_vaccin_types = await db.query.vaccineType.findMany({});
	return {
		get_vaccins,
		get_vaccin_types
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_vaccine: async ({ request }) => {
		const body = await request.formData();
		const { discription, vaccine_type_id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(vaccine)
			.values({
				discription: discription,
				vaccine_type_id: Number(vaccine_type_id)
			})
			.catch((e) => console.log(e));
	},
	update_vaccine: async ({ request }) => {
		const body = await request.formData();
		const { discription, vaccine_type_id, vaccine_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		await db
			.update(vaccine)
			.set({
				discription: discription,
				vaccine_type_id: Number(vaccine_type_id)
			})
			.where(eq(vaccine.id, Number(vaccine_id)))
			.catch((e) => console.log(e));
	},
	delete_vaccine: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(vaccine)
			.where(eq(vaccine.id, Number(id)))
			.catch((e) => console.log(e));
	}
};
