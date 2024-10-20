import { eq } from 'drizzle-orm';
import { db } from '../db';
import { billing } from '../schemas';
import { now_datetime } from '../utils';
import { isPaidService } from './isPaidService';
type TBillingProcess = {
	billing_id: number;
	tax: number;
	disc: string;
	note: string;
};
export async function billingProcess({ billing_id, tax, disc, note }: TBillingProcess) {
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, billing_id),
		with: {
			payment: true,
			charge: {
				with: {
					productOrder: true
				}
			}
		}
	});
	const sub_total = Number(get_billing?.sub_total);
	const total = disc.includes('%')
		? sub_total - (sub_total * Number(disc.replace('%', ''))) / 100
		: sub_total - Number(disc);
	const total_payment = get_billing?.payment.reduce((s, e) => s + Number(e.value), 0) || 0;
	const total_after_tax = total - (total * tax) / 100;
	const return_ = total_payment - total;
	if (total_payment === 0) {
		await db
			.update(billing)
			.set({
				total: total,
				discount: disc,
				balance: total,
				paid: 0,
				tax: tax,
				status: 'debt',
				return: 0,
				note: note,
				total_after_tax: total_after_tax,
				created_at: now_datetime()
			})
			.where(eq(billing.id, billing_id))
			.catch((e) => console.log(e));
	}
	if (total_payment >= total) {
		await db
			.update(billing)
			.set({
				total: total,
				discount: disc,
				balance: 0,
				paid: total,
				tax: tax,
				status: 'paid',
				note: note,
				return: return_,
				total_after_tax: total_after_tax,
				created_at: now_datetime()
			})
			.where(eq(billing.id, billing_id))
			.catch((e) => console.log(e));
	}
	if (total_payment < total && total_payment > 0) {
		await db
			.update(billing)
			.set({
				total: total,
				discount: disc,
				balance: total - total_payment,
				paid: total_payment,
				tax: tax,
				status: 'partial',
				return: 0,
				total_after_tax: total_after_tax,
				note: note,
				created_at: now_datetime()
			})
			.where(eq(billing.id, billing_id))
			.catch((e) => console.log(e));
	}
	if (get_billing?.billing_type === 'IPD') {
		await isPaidService(billing_id);
	}
}
