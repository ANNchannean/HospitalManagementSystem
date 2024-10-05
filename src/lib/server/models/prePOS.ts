import { db } from '../db';
import { billing, charge } from '../schemas';
import { logErrorMessage } from '../telegram/logErrorMessage';
import { now_datetime } from '../utils';

export const prePOS = async (): Promise<number> => {
	const get_tax = await db.query.tax.findFirst();
	const created_at = now_datetime();
	// doing billing
	const get_billing: { id: number }[] = await db
		.insert(billing)
		.values({
			created_at: created_at,
			status: 'paying',
			tax: get_tax?.value || 0,
			sub_total: 0,
			total: 0,
			checkin_type: 'POS'
		})
		.$returningId()
		.catch((e) => {
			logErrorMessage(e);
			return [];
		});
	await db
		.insert(charge)
		.values({
			billing_id: Number(get_billing[0].id),
			charge_on: 'general',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});

	return get_billing[0].id;
};
