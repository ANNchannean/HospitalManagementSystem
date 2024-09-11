import { db } from '$lib/server/db';
import { and, asc, eq, like, notLike, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { paymentType, product } from '$lib/server/schema';

export const load: PageServerLoad = async ({ url }) => {
	const get_currency = await db.query.currency.findFirst({});
	const group_type_id = url.searchParams.get('group_type_id') || '';
	const q = url.searchParams.get('q') || '';
	// if (get_billing?.status !== 'process') redirect(303, '/billing/opd');
	const get_product_group_type = await db.query.productGroupType.findMany({
		with: {
			unit: true
		}
	});
	const get_products = await db.query.product.findMany({
		where: and(
			group_type_id ? eq(product.group_type_id, +group_type_id) : undefined,
			or(like(product.products, `%${q}%`))
		),
		with: {
			unit: true,
			parameter: true,
			productGroupType: true,
			fileOrPicture: true
		},
		orderBy: asc(product.products)
	});

	const get_payment_types = await db.query.paymentType.findMany({
		orderBy: asc(paymentType.by),
		where: notLike(paymentType.by, '%CASH%')
	});
	return {
		get_products,
		get_product_group_type,
		get_payment_types,
		get_currency
	};
};
