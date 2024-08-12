import { db } from '$lib/server/db';
import { productGroupType, unit } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async ({ parent }) => {
	await parent();
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Medicine')
	});
	const get_unit_as_medicine = await db.query.unit.findMany({
		where: eq(unit.product_group_type_id, get_product_type?.id || 0)
	});
	return {
		get_unit_as_medicine
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_medicine_type: async ({ request }) => {
		const body = await request.formData();
		const { medicine_type } = Object.fromEntries(body) as Record<string, string>;
		const get_product_type = await db.query.productGroupType.findFirst({
			where: like(productGroupType.group_type, 'Medicine')
		});
		if (!medicine_type.trim()) return fail(400, { medicine_type: true });
		await db
			.insert(unit)
			.values({
				unit: medicine_type,
				product_group_type_id: get_product_type?.id
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_medicine_type: async ({ request }) => {
		const body = await request.formData();
		const { medicine_type, medicine_type_id } = Object.fromEntries(body) as Record<string, string>;
		if (!medicine_type.trim() || isNaN(+medicine_type_id))
			return fail(400, { medicine_type: true });
		await db
			.update(unit)
			.set({
				unit: medicine_type
			})
			.where(eq(unit.id, Number(medicine_type_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_medicine_type: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(unit)
			.where(eq(unit.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
