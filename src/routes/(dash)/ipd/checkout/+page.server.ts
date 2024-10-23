import { now_datetime } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { billing, progressNote } from '$lib/server/schemas';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { setChargePrice } from '$lib/server/models';

export const actions: Actions = {
	check_out: async ({ request }) => {
		const body = await request.formData();
		const { prescription, treatment, progress_note_id, date_checkout } = Object.fromEntries(
			body
		) as Record<string, string>;
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
		
		let inclund_pay = 'tre_and_pre' as 'treatment' | 'prescription' | 'tre_and_pre' | 'none';
		if (treatment) {
			inclund_pay = 'treatment';
		}
		if (prescription) {
			inclund_pay = 'prescription';
		}
		if (prescription && treatment) {
			inclund_pay = 'tre_and_pre';
		}
		if (!prescription && !treatment) {
			inclund_pay = 'none';
		}
		await db.transaction(async (tx) => {
			await tx
				.update(progressNote)
				.set({
					date_checkout: date_checkout ? null : now_datetime(),
					inclund_pay: inclund_pay
				})
				.where(eq(progressNote.id, +progress_note_id))
				.catch((e) => {
					logErrorMessage(e);
				});
			await tx
				.update(billing)
				.set({
					status: date_checkout ? 'paid' : 'paying'
				})
				.where(eq(billing.id, Number(get_progress_note?.billing?.id)));
		});
	},
	process_billing_service: async ({ request }) => {
		const body = await request.formData();
		const billing_id = body.get('id');
		if (!billing_id || isNaN(+billing_id)) return fail(303, { idErr: true });
		const get_billing = await db.query.billing.findFirst({
			where: eq(billing.id, +billing_id),
			with: {
				charge: true
			}
		});
		const charge_on_prescription = get_billing?.charge.find((e) => e.charge_on === 'prescription');
		const status = get_billing?.status === 'checking' ? 'paying' : 'checking';
		await db
			.update(billing)
			.set({
				status: status
			})
			.where(eq(billing.id, +billing_id))
			.catch((e) => {
				logErrorMessage(e);
			});

		await setChargePrice(charge_on_prescription?.id, 0);
	}
};
