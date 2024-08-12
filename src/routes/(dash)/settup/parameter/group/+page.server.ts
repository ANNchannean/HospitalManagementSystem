import { db } from '$lib/server/db';
import { parameter, product, productGroupType } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async () => {
	const get_lab_groups = await db.query.laboratoryGroup.findMany({});
	const get_units = await db.query.unit.findMany({});
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Laboratory')
	});
	const get_product_labo = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0),
		with: {
			laboratoryGroup: true,
			productGroupType: true,
			parameter: {
				with: {
					unit: true
				}
			}
		},
		orderBy: asc(product.products)
	});
	return {
		get_product_labo,
		get_lab_groups,
		get_units
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_parameter_group: async ({ request }) => {
		const body = await request.formData();
		const { product_name, lab_group_id, price } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			product_name: false,
			lab_group_id: false,
			price: false
		};
		if (!product_name.trim()) validErr.product_name = true;
		if (isNaN(+lab_group_id)) validErr.lab_group_id = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.insert(product)
			.values({
				price: +price,
				products: product_name,
				group_type_id: 5,
				laboratory_group_id: Number(lab_group_id)
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_parameter_group: async ({ request }) => {
		const body = await request.formData();
		const { product_name, lab_group_id, price, product_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			product_name: false,
			lab_group_id: false,
			price: false,
			product_id: false
		};
		if (!product_name.trim()) validErr.product_name = true;
		if (isNaN(+lab_group_id)) validErr.lab_group_id = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (isNaN(+product_id) || !product_id.trim()) validErr.product_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(product)
			.set({
				price: +price,
				products: product_name,
				laboratory_group_id: Number(lab_group_id)
			})
			.where(eq(product.id, Number(product_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_parameter_group: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(product)
			.where(eq(product.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	create_parameter: async ({ request }) => {
		const body = await request.formData();
		const { parameter_, description, unit_id, gender, mini, product_id, maxi, sign } =
			Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			parameter_: false,
			description: false,
			unit_id: false,
			gender: false,
			mini: false,
			product_id: false,
			maxi: false,
			sign: false
		};
		if (!parameter_.trim()) validErr.parameter_ = true;
		if (!gender.trim()) validErr.gender = true;
		if (isNaN(+product_id)) validErr.product_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.insert(parameter)
			.values({
				description: description,
				gender: gender,
				maxi: +maxi || 0,
				mini: +mini || 0,
				sign: sign,
				parameter: parameter_,
				unit_id: +unit_id || undefined,
				product_id: Number(product_id)
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
