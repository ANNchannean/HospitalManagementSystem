import { db } from '$lib/server/db';
import { vaccineDose } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_vaccine_dose = await db.query.vaccineDose.findMany({});
	return {
		get_vaccine_dose
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { description } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(vaccineDose).values({
			discription: description
		});
	},
	update_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { description, id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(vaccineDose)
			.set({
				discription: description
			})
			.where(eq(vaccineDose.id, +id));
	},
	delete_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(vaccineDose).where(eq(vaccineDose.id, +id));
	}
};
