import { db } from '$lib/server/db';
import { productGroupType, unit } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async () => {
	const get_product_group_types = await db.query.productGroupType.findMany({
		orderBy: asc(productGroupType.group_type)
	});
	const get_units = await db.query.unit.findMany({
		with: {
			productGroupType: true
		}
	});
	return {
		get_units,
		get_product_group_types
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_unit: async ({ request }) => {
		const body = await request.formData();
		const { unit_, product_group_type_id } = Object.fromEntries(body) as Record<string, string>;
		if (!unit_.trim()) return fail(400, { unit_: true });
		await db
			.insert(unit)
			.values({
				unit: unit_,
				product_group_type_id: product_group_type_id ? +product_group_type_id : undefined
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_unit: async ({ request }) => {
		const body = await request.formData();
		const { unit_, unit_id, product_group_type_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		await db
			.update(unit)
			.set({
				unit: unit_,
				product_group_type_id: product_group_type_id ? +product_group_type_id : null
			})
			.where(eq(unit.id, Number(unit_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_unit: async ({ request }) => {
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
