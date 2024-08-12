import { db } from '$lib/server/db';
import { product, productGroupType, unit } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async () => {
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Medicine')
	});
	const get_unit_as_medicineType = await db.query.unit.findMany({
		where: eq(unit.product_group_type_id, get_product_type?.id || 0)
	});

	const get_product_group_type = await db.query.productGroupType.findMany({});
	const get_products = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0),
		with: {
			productGroupType: true,
			unit: true
		}
	});
	return {
		get_products,
		get_product_group_type,
		get_unit_as_medicineType
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_medicine: async ({ request }) => {
		const body = await request.formData();
		const { name_product, unit_id, price } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			name_product: false,
			unit_id: false,
			price: false
		};
		const get_product_type = await db.query.productGroupType.findFirst({
			where: like(productGroupType.group_type, 'Medicine')
		});
		if (!name_product.trim()) validErr.name_product = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (isNaN(+unit_id)) validErr.unit_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.insert(product)
			.values({
				price: Number(price),
				products: name_product,
				group_type_id: get_product_type?.id,
				unit_id: Number(unit_id)
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_medicine: async ({ request }) => {
		const body = await request.formData();
		const { name_product, unit_id, price, product_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			name_product: false,
			product_id: false,
			unit_id: false,
			price: false
		};
		if (!name_product.trim()) validErr.name_product = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (isNaN(+product_id)) validErr.product_id = true;
		if (isNaN(+unit_id)) validErr.unit_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(product)
			.set({
				price: Number(price),
				products: name_product,
				unit_id: Number(unit_id)
			})
			.where(eq(product.id, Number(product_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_medicine: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(product)
			.where(eq(product.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
