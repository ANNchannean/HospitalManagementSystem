import { eq } from 'drizzle-orm';
import { db } from './db';
import { billing, charge, productOrder } from './schema';
import { now_datetime } from './utils';

export const deleteProductOrder = async (product_order_id: number) => {
	const get_product_order = await db.query.productOrder.findFirst({
		where: eq(productOrder.id, product_order_id)
	});
	await db.delete(productOrder).where(eq(productOrder.id, product_order_id));
	await updateCharge(Number(get_product_order?.charge_id));
};

export const createProductOrder = async ({
	charge_id,
	price,
	product_id
}: {
	charge_id: number;
	product_id: number;
	price: number;
}) => {
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
				qty: Number(get_product_order.qty) + 1
			})
			.where(eq(productOrder.id, get_product_order.id));
	} else {
		await db.insert(productOrder).values({
			price: +price,
			total: +price,
			product_id: product_id,
			created_at: now_datetime(),
			charge_id: charge_id
		});
	}
	await updateCharge(charge_id);
};

export const updateProductOrder = async ({
	product_order_id,
	disc,
	price,
	qty
}: {
	product_order_id: number;
	qty: number;
	price: number;
	disc: string;
}) => {
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
			.where(eq(productOrder.id, product_order_id));
	}
	await updateCharge(Number(get_product_order?.charge_id));
};

export const updateCharge = async (charge_id: number) => {
	const get_charge = await db.query.charge.findFirst({
		where: eq(charge.id, charge_id),
		with: { productOrder: true }
	});
	if (get_charge) {
		await db
			.update(charge)
			.set({
				price: get_charge.productOrder.reduce((s, e) => s + Number(e.total), 0)
			})
			.where(eq(charge.id, charge_id));
	}
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, get_charge?.billing_id || 0),
		with: { charge: true }
	});
	const sub_total = get_billing?.charge.reduce((s, e) => s + Number(e.price), 0);
	const total = Number(sub_total) - Number(get_billing?.discount);
	await db
		.update(billing)
		.set({
			total: total,
			sub_total: sub_total
		})
		.where(eq(billing.id, Number(get_billing?.id)));
};

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
			.where(eq(charge.id, charge_id));
	}
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, get_charge?.billing_id || 0),
		with: { charge: true }
	});
	const sub_total = get_billing?.charge.reduce((s, e) => s + Number(e.price), 0);
	const total = Number(sub_total) - Number(get_billing?.discount);
	await db
		.update(billing)
		.set({
			total: total,
			sub_total: sub_total
		})
		.where(eq(billing.id, Number(get_billing?.id)));
};

export const billingProcess = async ({
	billing_id,
	tax,
	disc,
	note
}: {
	billing_id: number;
	tax: number;
	disc: string;
	note: string;
}) => {
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, billing_id),
		with: {
			payment: true
		}
	});
	const sub_total = Number(get_billing?.sub_total);
	const price = sub_total;
	const total = disc.includes('%')
		? price - (price * Number(disc.replace('%', ''))) / 100
		: price - Number(disc);

	const total_payment = get_billing?.payment.reduce((s, e) => s + Number(e.value), 0) || 0;
	const total_after_tax = total - (total * tax) / 100;
	if (total_payment === 0) {
		await db
			.update(billing)
			.set({
				total: total,
				discount: disc,
				balance: total,
				paid: 0,
				tax: tax,
				status: 'due',
				note: note,
				total_after_tax: total_after_tax,
				date: now_datetime().slice(0, 10),
				time: now_datetime().slice(11, 19)
			})
			.where(eq(billing.id, billing_id));

		return;
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
				total_after_tax: total_after_tax,
				date: now_datetime().slice(0, 10),
				time: now_datetime().slice(11, 19)
			})
			.where(eq(billing.id, billing_id));
		return;
	}
	if (total_payment < total) {
		await db
			.update(billing)
			.set({
				total: total,
				discount: disc,
				balance: total - total_payment,
				paid: total_payment,
				tax: tax,
				status: 'partial',
				total_after_tax: total_after_tax,
				note: note,
				date: now_datetime().slice(0, 10),
				time: now_datetime().slice(11, 19)
			})
			.where(eq(billing.id, billing_id));
		return;
	}
};
