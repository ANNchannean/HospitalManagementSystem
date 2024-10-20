import { eq } from 'drizzle-orm';
import { billing, service } from '../schemas';
import { db } from '../db';

export async function isPaidService(billing_id: number) {
	const get_billing = await db.query.billing.findFirst({
		with: {
			progressNote: {
				with: {
					service: true
				}
			},
			payment: true,
			charge: {
				with: {
					productOrder: true
				}
			}
		},
		where: eq(billing.id, +billing_id)
	});
	if (get_billing?.progressNote?.service.length && get_billing.billing_type === 'IPD') {
		const charge_service = get_billing?.charge.find((e) => e.charge_on === 'service');
		let payment = get_billing.paid;
		for (const e of get_billing.progressNote.service) {
			const order_price =
				charge_service?.productOrder.find((e_) => e_.product_id === e.product_id)?.total || 0;
			payment = payment - order_price;
			if (payment >= 0) {
				await db
					.update(service)
					.set({
						is_paid_ipd: true
					})
					.where(eq(service.id, e.id));
			} else {
				await db
					.update(service)
					.set({
						is_paid_ipd: false
					})
					.where(eq(service.id, e.id));
			}
		}
	}
}
