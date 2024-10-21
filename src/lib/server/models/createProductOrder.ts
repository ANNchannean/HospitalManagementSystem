import { eq } from 'drizzle-orm';
import { db } from '../db';
import { charge, productOrder } from '../schemas';
import { now_datetime } from '../utils';
import { updateCharge } from './updateCharge';
type TCProductOrder = {
	charge_id: number;
	product_id: number;
	price: number;
	qty: number;
};
export async function createProductOrder({ charge_id, price, product_id, qty }: TCProductOrder) {
	const get_charge = await db.query.charge.findFirst({
		where: eq(charge.id, charge_id),
		with: { productOrder: true }
	});
	const get_product_order = get_charge?.productOrder.find((e) => e.product_id === product_id);
	if (get_product_order) {
		const calulator_disc = get_product_order!.discount!.includes('%')
			? price - (price * Number(get_product_order!.discount!.replace('%', ''))) / 100
			: price - Number(get_product_order.discount);
		await db
			.update(productOrder)
			.set({
				total: Number(calulator_disc) * (Number(get_product_order.qty) + 1),
				qty: Number(get_product_order.qty) + qty
			})
			.where(eq(productOrder.id, get_product_order.id))
			.catch((e) => console.log(e));
	} else {
		await db
			.insert(productOrder)
			.values({
				price: +price,
				total: +price,
				product_id: product_id,
				created_at: now_datetime(),
				charge_id: charge_id,
				qty: qty
			})
			.catch((e) => console.log(e));
	}
	await updateCharge(charge_id);
}
