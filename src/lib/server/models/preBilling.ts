import { db } from '../db';
import { billing, charge } from '../schemas';
import { logErrorMessage } from '../telegram/logErrorMessage';
import { now_datetime } from '../utils';

type TPreBilling = {
	visit_id: number | null;
	progress_id: number | null;
	patient_id: number;
	checkin_type: 'OPD' | 'IPD' | 'POS';
};
export const preBilling = async ({
	checkin_type,
	progress_id,
	visit_id,
	patient_id
}: TPreBilling) => {
	const created_at = now_datetime();
	const get_tax = await db.query.tax.findFirst();
	// doing billing
	const billing_id: { id: number }[] = await db
		.insert(billing)
		.values({
			created_at: created_at,
			visit_id: visit_id,
			progress_note_id: progress_id,
			checkin_type: checkin_type,
			patient_id: patient_id,
			status: 'active',
			tax: get_tax?.value || 0,
			sub_total: 0,
			total: 0
		})
		.$returningId()
		.catch((e) => {
			logErrorMessage(e);
			return [];
		});
	await Promise.all([
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'general',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'imagerie',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'laboratory',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'prescription',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'service',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'vaccine',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			}),
		await db
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'bed',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			})
	]);
};
