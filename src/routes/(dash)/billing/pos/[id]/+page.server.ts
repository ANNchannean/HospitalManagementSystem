import { db } from '$lib/server/db';
import { and, asc, eq, gt, like, ne, notLike, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing,  paymentType, product } from '$lib/server/schemas';
export const load: PageServerLoad = async ({ url, params }) => {
	const { id: billing_id } = params;
	const get_currency = await db.query.currency.findFirst({});
	const group_type_id = url.searchParams.get('group_type_id') || '';
	const q = url.searchParams.get('q') || '';
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, +billing_id || 0),
		with: {
			payment:{
				with:{
					paymentType:true
				}
			},
			patient: true,
			visit: {
				with: {
					presrciption: {
						with: {
							product: true
						}
					}
				}
			},
			charge: {
				with: {
					productOrder: {
						with: {
							product: true
						}
					}
				}
			}
		}
	});

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
	const charge_on_general = get_billing?.charge.find((e) => e.charge_on === 'general');
	const get_patients = await db.query.patient.findMany({
		with: {
			commune: true,
			district: true,
			provice: true,
			village: true
		}
	});
	const get_billings_due = await db.query.billing.findMany({
		where: and(
			gt(billing.balance, 0),
			eq(billing.patient_id, get_billing?.patient_id || 0),
			ne(billing.id, +billing_id)
		)
	});
	return {
		get_products,
		get_product_group_type,
		charge_on_general,
		get_billing,
		get_payment_types,
		get_currency,
		get_patients,
		get_billings_due
	};
};

