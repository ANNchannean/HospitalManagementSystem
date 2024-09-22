import { eq } from 'drizzle-orm';
import { productOrder } from '../schemas';
import { updateCharge } from './updateCharge';
import { db } from '../db';

type TUProductOrder = {
	product_order_id: number;
	qty: number;
	price: number;
	disc: string;
};
export const updateProductOrder = async ({
	product_order_id,
	disc,
	price,
	qty
}: TUProductOrder) => {
	const get_product_order = await db.query.productOrder.findFirst({
		where: eq(productOrder.id, product_order_id),
		with: {
			product: true,
			charge: true
		}
	});
	if (get_product_order) {
		const calulator_disc = disc.includes('%')
			? price - (price * Number(disc.replace('%', ''))) / 100
			: price - Number(disc);
		await db
			.update(productOrder)
			.set({
				price: +price,
				discount: disc,
				qty: +qty,
				total: calulator_disc * +qty
			})
			.where(eq(productOrder.id, product_order_id))
			.catch((e) => console.log(e));
	}
	await updateCharge(Number(get_product_order?.charge_id));
};
