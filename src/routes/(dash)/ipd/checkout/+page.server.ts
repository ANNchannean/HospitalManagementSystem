import { now_datetime } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { billing, charge, progressNote } from '$lib/server/schemas';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { updatChargeByValue } from '$lib/server/models';

export const actions: Actions = {
	check_out: async ({ request }) => {
		const body = await request.formData();
		const { charge_prescription, charge_trantment, progress_note_id, date_checkout } =
			Object.fromEntries(body) as Record<string, string>;
		if (!progress_note_id) return fail(400, { progress_note_id: true });
		const get_progress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +progress_note_id),
			with: {
				billing: true,
				visit: {
					with: {
						billing: {
							with: {
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
						}
					}
				}
			}
		});
		const all_visit = get_progress_note?.visit || [];
		for (const e of all_visit) {
			for (const e1 of e.billing?.charge || []) {
				if (!charge_prescription) {
					if (e1.charge_on === 'prescription') {
						updatChargeByValue(e1.id, 0);
					}
				}
				if (!charge_trantment) {
					if (e1.charge_on !== 'prescription') {
						updatChargeByValue(e1.id, 0);
					}
				}
			}
		}
		await db.transaction(async (tx) => {
			await tx
				.update(progressNote)
				.set({
					date_checkout: date_checkout ? null : now_datetime()
				})
				.where(eq(progressNote.id, +progress_note_id))
				.catch((e) => {
					logErrorMessage(e);
				});
			await tx
				.update(billing)
				.set({
					status: 'paying'
				})
				.where(eq(billing.id, Number(get_progress_note?.billing?.id)));
		});
	},
	process_billing: async ({ request }) => {
		const body = await request.formData();
		const billing_id = body.get('id');
		if (!billing_id || isNaN(+billing_id)) return fail(303, { idErr: true });
		const get_billing = await db.query.billing.findFirst({
			where: eq(billing.id, +billing_id),
			with: {
				charge: true
			}
		});
		const charge_on_service = get_billing?.charge.find((e) => e.charge_on === 'service');
		const status = get_billing?.status === 'checking' ? 'paying' : 'checking';
		await db.transaction(async (tx) => {
			await tx
				.update(billing)
				.set({
					status: status
				})
				.where(eq(billing.id, +billing_id))
				.catch((e) => {
					logErrorMessage(e);
				});
			// await tx
			// 	.update(charge)
			// 	.set({
			// 		status: charge_on_service?.status === 'payment' ? 'checking' : 'payment'
			// 	})
			// 	.where(eq(charge.id, Number(charge_on_service?.id)));
		});
	}
};
