import { db } from '$lib/server/db';
import { product, vaccineDose } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_vaccines = await db.query.product.findMany({
		where: eq(product.group_type_id, 3),
		with: {
			unit: true,
			vaccineDose: true
		}
	});
	return {
		get_vaccines
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { description, vaccine_id } = Object.fromEntries(body) as Record<string, string>;
		const vaccine_dose_id = await db
			.insert(vaccineDose)
			.values({
				discription: description
			})
			.$returningId();
		await db
			.update(product)
			.set({
				vaccine_dose_id: vaccine_dose_id[0].id
			})
			.where(eq(product.id, +vaccine_id));
	},
	update_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { description, vaccine_dose_id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(vaccineDose)
			.set({
				discription: description
			})
			.where(eq(vaccineDose.id, +vaccine_dose_id));
	},
	delete_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(vaccineDose).where(eq(vaccineDose.id, +id));
	}
};
