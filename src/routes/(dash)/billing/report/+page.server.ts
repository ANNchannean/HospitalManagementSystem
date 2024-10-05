import { db } from '$lib/server/db';
import { and, between, desc, eq, gt, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { billing, fileOrPicture, payment } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import { now_datetime, pagination } from '$lib/server/utils';
import { deleteFile, uploadFile } from '$lib/server/upload/fileHandle';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { billingProcess } from '$lib/server/models';

export const load: PageServerLoad = async ({ parent, url }) => {
	await parent();
	let p = false;
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 10;
	const start = url.searchParams.get('start') ?? '';
	const end = url.searchParams.get('end') ?? '';
	const billing_type = url.searchParams.get('billing_type') as 'IPD' | 'OPD' | 'POS';
	const patient_id = Number(url.searchParams.get('patient_id'));
	const status = url.searchParams.get('status') as
		| 'paid'
		| 'partial'
		| 'debt'
		| 'checkup'
		| 'paying';
	if (start || end || patient_id || status || billing_type) p = true;

	const _currency = async () => await db.query.currency.findFirst({});
	const _billings = async () =>
		await db.query.billing.findMany({
			where: p
				? and(
						status ? eq(billing.status, status) : undefined,
						patient_id ? eq(billing.patient_id, patient_id) : undefined,
						start && end ? between(billing.created_at, start, end) : undefined,
						billing_type ? eq(billing.billing_type, billing_type) : undefined,
						gt(billing.total, 0)
					)
				: or(eq(billing.status, 'paid'), eq(billing.status, 'debt'), eq(billing.status, 'partial')),
			with: {
				patient: {
					with: {
						commune: true,
						district: true,
						provice: true,
						village: true
					}
				},
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
			},
			orderBy: desc(billing.created_at),
			limit: pagination(page, limit).limit,
			offset: pagination(page, limit).offset
		});
	const _items = async () =>
		await db.query.billing.findMany({
			where: p
				? and(
						status ? eq(billing.status, status) : undefined,
						patient_id ? eq(billing.patient_id, patient_id) : undefined,
						start && end ? between(billing.created_at, start, end) : undefined,
						billing_type ? eq(billing.billing_type, billing_type) : undefined,
						gt(billing.total, 0)
					)
				: or(eq(billing.status, 'paid'), eq(billing.status, 'debt'), eq(billing.status, 'partial'))
		});
	const _payment_types = async () => await db.query.paymentType.findMany();
	const _patients = async () => await db.query.patient.findMany({});
	const [get_currency, get_billings, items, get_payment_types, get_patients] = await Promise.all([
		_currency(),
		_billings(),
		_items(),
		_payment_types(),
		_patients()
	]);
	return {
		get_billings,
		get_payment_types,
		get_currency,
		items: items.length,
		get_patients
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
			await db
				.insert(fileOrPicture)
				.values({
					payment_id: get_payment?.id,
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
			await db
				.delete(payment)
				.where(eq(payment.id, +payment_id))
				.catch((e) => {
					logErrorMessage(e);
				});
			await billingProcess({
				billing_id: get_billing!.id,
				disc: get_billing!.discount,
				note: get_billing!.note ?? '',
				tax: get_billing!.tax
			});
		}
	}
};
