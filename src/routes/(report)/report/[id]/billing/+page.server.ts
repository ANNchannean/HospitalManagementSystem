import { db } from '$lib/server/db';
import { billing } from '$lib/server/schema';
import { and, eq, gt, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const get_currency = await db.query.currency.findFirst({});
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, +id),
		with: {
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
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
	const get_billings = await db.query.billing.findMany({
		where: and(
			gt(billing.balance, 0),
			eq(billing.patient_id, get_billing?.patient_id || 0),
			ne(billing.id, +id)
		)
	});
	const previous_due = get_billings.reduce((s, i) => s + i.balance, 0);

	return {
		get_billing,
		get_currency,
		get_clinic_info,
		previous_due
	};
}) satisfies PageServerLoad;
