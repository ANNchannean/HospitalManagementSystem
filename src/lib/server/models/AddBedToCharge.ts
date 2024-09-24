import { eq } from 'drizzle-orm';
import { db } from '../db';
import createProductOrder from './createProductOrder';
import { visit } from '../schemas';

export async function AddBedToCharge({
	product_id,
	price,
	visit_id
}: {
	product_id: number;
	price: number;
	visit_id: number;
}) {
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, visit_id),
		with: {
			billing: {
				with: {
					charge: true
				}
			}
		}
	});
	const charge_on_bed = get_visit?.billing?.charge.find((e) => e.charge_on === 'bed');
	if (!charge_on_bed) return;
	await createProductOrder({
		charge_id: charge_on_bed?.id,
		price: price,
		product_id: product_id
	});
}
