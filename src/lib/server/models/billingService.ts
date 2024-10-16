import { db } from '../db';
import { billing, charge } from '../schemas';
import { logErrorMessage } from '../telegram/logErrorMessage';
import { now_datetime } from '../utils';

type TPreBilling = {
	progress_id: number | null;
	patient_id: number;
};
export const billingService = async ({ progress_id, patient_id }: TPreBilling) => {
	const created_at = now_datetime();
	await db.transaction(async (tx) => {
		const get_tax = await tx.query.tax.findFirst();
		// doing billing
		const billing_id: { id: number }[] = await tx
			.insert(billing)
			.values({
				created_at: created_at,
				progress_note_id: progress_id,
				billing_type: 'IPD',
				patient_id: patient_id,
				status: 'checking',
				tax: get_tax?.value || 0,
				sub_total: 0,
				total: 0
			})
			.$returningId()
			.catch((e) => {
				logErrorMessage(e);
				return [];
			});

		await tx
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'general',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			});
		await tx
			.insert(charge)
			.values({
				billing_id: billing_id[0].id,
				charge_on: 'service',
				created_at: created_at
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	});
};