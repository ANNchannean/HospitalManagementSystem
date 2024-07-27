import { db } from '$lib/server/db';
import { and, asc, desc, eq, like, notIlike, notLike, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { billing, fileOrPicture, payment, paymentType, product } from '$lib/server/schema';
import {
	billingProcess,
	createProductOrder,
	deleteProductOrder,
	updatChargeByValue,
	updateProductOrder
} from '$lib/server/models';
import { fail, redirect } from '@sveltejs/kit';
import { now_datetime } from '$lib/server/utils';
import { uploadFile } from '$lib/server/fileHandle';

export const load: PageServerLoad = async ({ url, params }) => {
	const { id: billing_id } = params;
	const group_type_id = url.searchParams.get('group_type_id') || '';
	const q = url.searchParams.get('q') || '';
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, +billing_id || 0),
		with: {
			visit: {
				with: {
					patient: true,
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
	if (get_billing?.status !== 'process') redirect(303, '/billing/opd');
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
			productGroupType: true
		},
		orderBy: asc(product.products),
		limit: 200
	});
	const get_billings = await db.query.billing.findMany({
		where: and(eq(billing.status, 'due'), eq(billing.checkin_type, 'OPD')),
		with: {
			visit: {
				with: {
					patient: true
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

	const get_payment_types = await db.query.paymentType.findMany({
		orderBy: asc(paymentType.by),
		where: notLike(paymentType.by, '%CASH%')
	});
	const charge_on_imagerie = get_billing?.charge.find((e) => e.charge_on === 'imagerie');
	const charge_on_laboratory = get_billing?.charge.find((e) => e.charge_on === 'laboratory');
	const charge_on_general = get_billing?.charge.find((e) => e.charge_on === 'general');
	const charge_on_service = get_billing?.charge.find((e) => e.charge_on === 'service');
	const charge_on_prescription = get_billing?.charge.find((e) => e.charge_on === 'prescription');
	const get_tax = await db.query.tax.findFirst();
	return {
		get_billings,
		get_products,
		get_product_group_type,
		charge_on_imagerie,
		charge_on_laboratory,
		charge_on_general,
		charge_on_service,
		charge_on_prescription,
		get_billing,
		get_payment_types,
		get_tax
	};
};

export const actions: Actions = {
	create_product_order: async ({ request, params }) => {
		const { id: billing_id } = params;
		const body = await request.formData();
		const { product_id, price } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			product_id: false,
			billing_id: false,
			same_product: false
		};

		const get_billing = async () =>
			await db.query.billing.findFirst({
				where: eq(billing.id, +billing_id || 0),
				with: {
					visit: {
						with: {
							patient: true,
							presrciption: true
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
		const billing_data = await get_billing();
		const charge_on_general = billing_data?.charge.find((e) => e.charge_on === 'general');
		if (!product_id.trim()) validErr.product_id = true;
		if (!billing_id.trim()) validErr.billing_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);

		await createProductOrder({
			charge_id: Number(charge_on_general?.id),
			price: +price,
			product_id: +product_id
		});
	},
	remove_product_order: async ({ request, url }) => {
		const body = await request.formData();
		const { product_order_id } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			product_order_id: false
		};
		if (!product_order_id.trim()) validErr.product_order_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await deleteProductOrder(+product_order_id);
	},
	update_product_order: async ({ request }) => {
		const body = await request.formData();
		const product_order_id = body.getAll('product_order_id');
		const qty = body.getAll('qty');
		const disc = body.getAll('disc');
		const price = body.getAll('price');
		const charge_id = body.get('charge_id') ?? '';
		const charge_on_laboratory = body.get('charge_on_laboratory') ?? '';
		if (!product_order_id.length) return fail(400, { errProductOrder: true });
		for (let index = 0; index < product_order_id.length; index++) {
			const product_order_id_ = product_order_id[index];
			const qty_ = qty[index];
			const disc_ = disc[index].toString();
			const price_ = price[index];
			if (isNaN(+disc_) && !disc_.toString().includes('%')) return fail(400, { disc: true });
			await updateProductOrder({
				disc: disc_,
				price: +price_,
				product_order_id: +product_order_id_,
				qty: +qty_
			});
		}
		if (charge_id) {
			await updatChargeByValue(+charge_id, +charge_on_laboratory);
		}
	},
	update_billing: async ({ request, params }) => {
		const { id: billing_id } = params;
		const get_payment_type = await db.query.paymentType.findFirst({
			where: like(paymentType.by, '%CASH%')
		});
		const body = await request.formData();

		const { bank_pay, cash_pay, payment_type_id, disc_value, note, tax } = Object.fromEntries(
			body
		) as Record<string, string>;
		const file = body.get('image') as File;
		const validErr = {
			payment: false
		};
		if (!bank_pay && !cash_pay) validErr.payment = true;
		if (!bank_pay && !payment_type_id) validErr.payment = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		if (Number(bank_pay) > 0 && payment_type_id) {
			const date_time = now_datetime();
			await db.insert(payment).values({
				billing_id: +billing_id,
				datetime: date_time,
				payment_type_id: +payment_type_id,
				value: +bank_pay
			});
		}
		if (Number(cash_pay) > 0) {
			await db.insert(payment).values({
				billing_id: +billing_id,
				datetime: now_datetime(),
				payment_type_id: get_payment_type?.id,
				value: +cash_pay
			});
		}
		if (file.size) {
			await db.insert(fileOrPicture).values({
				billing_id: +billing_id,
				filename: await uploadFile(file),
				size: file.size,
				mimeType: file.type
			});
		}
		await billingProcess({
			billing_id: +billing_id,
			disc: disc_value,
			tax: +tax || 0,
			note: note.toString()
		});
	}
};
