import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { billing, fileOrPicture, payment } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { now_datetime } from '$lib/server/utils';
import { deleteFile, uploadFile } from '$lib/server/fileHandle';
import { billingProcess } from '$lib/server/models';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const get_billings = await db.query.billing.findMany({
		where: and(
			eq(billing.checkin_type, 'OPD'),
			or(eq(billing.status, 'paid'), eq(billing.status, 'due'), eq(billing.status, 'partial'))
		),
		with: {
			visit: {
				with: {
					patient: {
						with: {
							commune: true,
							district: true,
							provice: true,
							village: true
						}
					},
					staff: true,
					department: true
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
			},
			payment: {
				with: {
					paymentType: true,
					fileOrPicture: true
				}
			}
		}
	});
	const get_payment_types = await db.query.paymentType.findMany();
	return {
		get_billings,
		get_payment_types
	};
};

export const actions: Actions = {
	repayment: async ({ request }) => {
		const body = await request.formData();
		const { value, payment_type_id, billing_id, note, disc, tax } = Object.fromEntries(
			body
		) as Record<string, string>;
		const file = body.get('file') as File;
		const validErr = {
			value: false,
			payment_type_id: false,
			billing_id: false
		};
		if (isNaN(+value)) validErr.value = true;
		if (!payment_type_id) validErr.payment_type_id = true;
		if (!billing_id) validErr.billing_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const dateitme = now_datetime();
		const paymentId = await db
			.insert(payment)
			.values({
				billing_id: +billing_id,
				note: note,
				payment_type_id: +payment_type_id,
				value: +value,
				datetime: dateitme
			})
			.$returningId();
		const get_payment = await db.query.payment.findFirst({
			where: eq(payment.id, paymentId[0].id)
		});
		if (file.size) {
			await db.insert(fileOrPicture).values({
				payment_id: get_payment?.id,
				filename: await uploadFile(file),
				size: file.size,
				mimeType: file.type
			});
		}
		await billingProcess({
			billing_id: +billing_id,
			disc: disc,
			tax: +tax,
			note: note
		});
	},
	delete_payment: async ({ request }) => {
		const body = await request.formData();
		const { id: payment_id } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			payment_id: false
		};

		if (!payment_id) validErr.payment_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_payment = await db.query.payment.findFirst({
			where: eq(payment.id, +payment_id),
			with: {
				billing: true,
				fileOrPicture: true
			}
		});
		if (get_payment?.fileOrPicture?.filename) await deleteFile(get_payment.fileOrPicture.filename);
		const get_billing = await db.query.billing.findFirst({
			where: eq(billing.id, get_payment?.billing_id || 0)
		});
		if (get_billing) {
			await db.delete(payment).where(eq(payment.id, +payment_id));
			await billingProcess({
				billing_id: get_billing!.id,
				disc: get_billing!.discount,
				note: get_billing!.note ?? '',
				tax: get_billing!.tax
			});
		}
	}
};
