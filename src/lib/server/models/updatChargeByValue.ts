import { eq } from 'drizzle-orm';
import { db } from '../db';
import { billing, charge } from '../schemas';

export const updatChargeByValue = async (charge_id: number, total_charge: number) => {
	const get_charge = await db.query.charge.findFirst({
		where: eq(charge.id, charge_id),
		with: { productOrder: true }
	});
	if (get_charge) {
		await db
			.update(charge)
			.set({
				price: total_charge
			})
			.where(eq(charge.id, charge_id))
			.catch((e) => console.log(e));
	}
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, get_charge?.billing_id || 0),
		with: { charge: true }
	});
	const sub_total = get_billing?.charge.reduce((s, e) => s + Number(e.price), 0) || 0;
	const calulator_disc = get_billing?.discount?.includes('%')
		? sub_total - (sub_total * Number(get_billing?.discount.replace('%', ''))) / 100
		: sub_total - Number(get_billing?.discount);

	await db
		.update(billing)
		.set({
			total: calulator_disc,
			sub_total: sub_total
		})
		.where(eq(billing.id, Number(get_billing?.id)))
		.catch((e) => console.log(e));
};