import { eq } from 'drizzle-orm';
import { db } from '../db';
import { productOrder } from '../schemas';
import { updateCharge } from './updateCharge';

export const deleteProductOrder = async (product_order_id: number) => {
	const get_product_order = await db.query.productOrder.findFirst({
		where: eq(productOrder.id, product_order_id)
	});
	await db.delete(productOrder).where(eq(productOrder.id, product_order_id));
	await updateCharge(Number(get_product_order?.charge_id));
};
