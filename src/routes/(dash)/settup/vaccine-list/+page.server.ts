import { db } from '$lib/server/db';
import { unit } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_unit_as_vaccine = await db.query.unit.findMany({
		where: eq(unit.product_group_type_id, 3)
	});
	return {
		get_unit_as_vaccine
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_vaccine_dose: async ({ request }) => {
		const body = await request.formData();
		const { description, unit_id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(unit)
			.set({
				vaccine_dose: description
			})
			.where(eq(unit.id, +unit_id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
