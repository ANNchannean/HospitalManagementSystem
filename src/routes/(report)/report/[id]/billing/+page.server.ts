import { db } from '$lib/server/db';
import { billing } from '$lib/server/schemas';
import { and, eq, gt, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

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
			progressNote: true,
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
	if (get_billing?.billing_type === 'IPD') {
		return redirect(307, `/report/${id}/billing/ipd`);
	}
	if (get_billing?.billing_type === 'OPD') {
		return redirect(307, `/report/${id}/billing/opd`);
	}
	if (get_billing?.billing_type === 'CHECKING') {
		return redirect(307, `/report/${id}/billing/checking`);
	}
	const previous_due = get_billings.reduce((s: number, i) => s + +i.balance, 0);
	return {
		get_billing,
		get_currency,
		get_clinic_info,
		previous_due
	};
}) satisfies PageServerLoad;
