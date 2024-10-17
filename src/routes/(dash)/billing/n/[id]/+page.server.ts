import { db } from '$lib/server/db';
import { eq, like } from 'drizzle-orm';
import type { Actions } from './$types';
import { billing, fileOrPicture, payment, paymentType } from '$lib/server/schemas';
import {
	billingProcess,
	createProductOrder,
	deleteProductOrder,
	setChargePrice,
	updateProductOrder
} from '$lib/server/models';
import { fail, redirect } from '@sveltejs/kit';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { uploadFile } from '$lib/server/upload/fileHandle';

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
					patient: true,
					visit: {
						with: {
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
			product_id: +product_id,
			qty: 1
		}).catch((e) => {
			logErrorMessage(e);
		});
	},
	remove_product_order: async ({ request }) => {
		const body = await request.formData();
		const { product_order_id } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			product_order_id: false
		};
		if (!product_order_id.trim()) validErr.product_order_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await deleteProductOrder(+product_order_id).catch((e) => {
			logErrorMessage(e);
		});
	},
	update_product_order: async ({ request }) => {
		const body = await request.formData();
		const product_order_id = body.getAll('product_order_id');
		const qty = body.getAll('qty');
		const disc = body.getAll('disc');
		const price = body.getAll('price');
		const charge_id = body.get('charge_id') ?? '';
		const charge_on_laboratory = body.get('charge_on_laboratory') ?? '';
		if (!product_order_id.length && !charge_id) return fail(400, { errProductOrder: true });
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
			}).catch((e) => {
				logErrorMessage(e);
			});
		}
		if (charge_id) {
			await setChargePrice(+charge_id, +charge_on_laboratory).catch((e) => {
				logErrorMessage(e);
			});
		}
	},
	process_billing: async ({ request, params }) => {
		const { id: billing_id } = params;
		const get_payment_type = await db.query.paymentType.findFirst({
			where: like(paymentType.by, '%CASH%')
		});
		const body = await request.formData();
		const { bank_pay, cash_pay, payment_type_id, disc, note, tax } = Object.fromEntries(
			body
		) as Record<string, string>;
		const file = body.get('image') as File;
		const validErr = {
			payment: false,
			billing_disc: false
		};
		if (isNaN(+disc) && !disc.includes('%')) validErr.billing_disc = true;
		if (!bank_pay && !cash_pay) validErr.payment = true;
		if (!bank_pay && !payment_type_id) validErr.payment = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		if (Number(bank_pay) > 0 && payment_type_id) {
			const date_time = now_datetime();
			await db
				.insert(payment)
				.values({
					billing_id: +billing_id,
					datetime: date_time,
					payment_type_id: +payment_type_id,
					value: +bank_pay
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (Number(cash_pay) > 0) {
			await db
				.insert(payment)
				.values({
					billing_id: +billing_id,
					datetime: now_datetime(),
					payment_type_id: get_payment_type?.id,
					value: +cash_pay
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (file.size) {
			await db
				.insert(fileOrPicture)
				.values({
					billing_id: +billing_id,
					filename: await uploadFile(file),
					size: file.size,
					mimeType: file.type
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		await billingProcess({
			billing_id: +billing_id,
			disc: disc,
			tax: +tax || 0,
			note: note.toString()
		});

		

		redirect(303, `/report/${billing_id}/billing`);
	},
	hold: async ({ params }) => {
		const { id: billing_id } = params;
		await db
			.update(billing)
			.set({
				hold: true
			})
			.where(eq(billing.id, +billing_id));
		redirect(303, '/billing/opd');
	},
	delete_payment: async ({ params }) => {
		const { id } = params;
		await db
			.delete(payment)
			.where(eq(payment.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
