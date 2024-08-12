import { db } from '$lib/server/db';
import { product, productGroupType, template } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async () => {
	const get_imageerie_groups = await db.query.imagerieGroup.findMany({});
	const get_product_group_type = await db.query.productGroupType.findMany({});
	const get_templates = await db.query.template.findMany({
		orderBy: asc(template.diagnosis)
	});
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Imagerie')
	});
	const get_products = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0),
		with: {
			imagerieGroup: true
		}
	});
	return {
		get_products,
		get_product_group_type,
		get_templates,
		get_imageerie_groups
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_ImagerieGroup: async ({ request }) => {
		const body = await request.formData();
		const { name_product, imagerie_group_id, price } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			name_product: false,
			imagerie_group_id: false,
			price: false
		};
		if (!name_product.trim()) validErr.name_product = true;
		if (isNaN(+price)) validErr.price = true;
		if (isNaN(+imagerie_group_id)) validErr.imagerie_group_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.insert(product)
			.values({
				price: Number(price),
				products: name_product,
				imagerie_group_id: +imagerie_group_id,
				group_type_id: 2
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_ImagerieGroup: async ({ request }) => {
		const body = await request.formData();
		const { name_product, imagerie_group_id, price, product_id } = Object.fromEntries(
			body
		) as Record<string, string>;
		await db
			.update(product)
			.set({
				price: Number(price),
				products: name_product,
				imagerie_group_id: Number(imagerie_group_id)
			})
			.where(eq(product.id, Number(product_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_ImagerieGroup: async ({ request }) => {
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
