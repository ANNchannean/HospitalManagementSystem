import { eq } from 'drizzle-orm';
import { db } from './db';
import { billing, charge, productOrder } from './schema';
import { now_datetime } from './utils';
import { billingMessage, logErrorMessage } from './telegram';

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
				charge_id: charge_id
			})
			.catch((e) => console.log(e));
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
			.where(eq(productOrder.id, product_order_id))
			.catch((e) => console.log(e));
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
	const total = disc.includes('%')
		? sub_total - (sub_total * Number(disc.replace('%', ''))) / 100
		: sub_total - Number(disc);
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
				total_after_tax: total_after_tax,
				date: now_datetime().slice(0, 10),
				time: now_datetime().slice(11, 19)
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
				total_after_tax: total_after_tax,
				note: note,
				date: now_datetime().slice(0, 10),
				time: now_datetime().slice(11, 19)
			})
			.where(eq(billing.id, billing_id))
			.catch((e) => console.log(e));
	}
	const billing_ = await db.query.billing.findFirst({
		where: eq(billing.id, billing_id),
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
	});
	const status_ = billing_?.status;
	const balance_ = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		billing_?.balance ?? 0
	);
	const paid_ = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		billing_?.paid ?? 0
	);
	const sub_total_ = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		billing_?.sub_total ?? 0
	);
	const total_ = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		billing_?.total ?? 0
	);
	const discount_ = billing_?.discount.includes('%')
		? billing_?.discount
		: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
				Number(billing_?.discount ?? 0)
			);
	const products =
		billing_?.charge.flatMap((e) =>
			e.productOrder.flatMap((e) => ({
				product: e.product.products,
				qty: e.qty,
				price: e.price,
				disc: e.discount,
				total: e.total
			}))
		) ?? [];
	let table = '';
	for (let index = 0; index < products.length; index++) {
		const element = products[index];
		table = table.concat(
			'__________________________________________'
				.concat('%0A')
				.concat(String(index + 1))
				.concat('       = ')
				.concat(element.product)
				.concat('%0A')
				.concat('qty    = ')
				.concat(String(element.qty))
				.concat('%0A')
				.concat('price  = ')
				.concat(
					new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
						element.price ?? 0
					)
				)
				.concat('%0A')
				.concat('disc   = ')
				.concat(
					element.disc.includes('%')
						? element.disc
						: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
								Number(element.disc ?? 0)
							)
				)
				.concat('%0A')
				.concat('total  = ')
				.concat(
					new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
						element.total ?? 0
					)
				)
				.concat('%0A')
		);
	}
	const message = '%0A'
		.concat(table)
		.concat('*********************************************')
		.concat('%0A')
		.concat('- status ')
		.concat(status_ ?? '')
		.concat('%0A')
		.concat('- sub total ')
		.concat(sub_total_)
		.concat('%0A')
		.concat('- disc ')
		.concat(discount_)
		.concat('%0A')
		.concat('- total ')
		.concat(total_)
		.concat('%0A')
		.concat('- balance ')
		.concat(balance_)
		.concat('%0A')
		.concat('- paid ')
		.concat(paid_)
		.concat('%0A')
		.concat('- invoce id ')
		.concat(billing_?.id.toString() ?? '')
		.concat('%0A')
		.concat('- Invoce Date ')
		.concat(
			new Intl.DateTimeFormat('en-GB', {
				dateStyle: 'short',
				timeStyle: 'short',
				hour12: true
			}).format(new Date(billing_?.date?.concat(' ').concat(billing_?.time ?? '') ?? ''))
		);

	billingMessage(message);
};

export const preBilling = async (visit_id: number, checkin_type: 'OPD' | 'IPD') => {
	const created_at = now_datetime();
	const get_tax = await db.query.tax.findFirst();
	// doing billing
	await db
		.insert(billing)
		.values({
			created_at: created_at,
			visit_id: checkin_type === 'OPD' ? visit_id : null,
			progress_note_id: checkin_type === 'IPD' ? visit_id : null,
			checkin_type: checkin_type,
			status: 'active',
			tax: get_tax?.value || 0
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.created_at, created_at)
	});
	await db
		.insert(charge)
		.values({
			billing_id: Number(get_billing?.id),
			charge_on: 'general',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	await db
		.insert(charge)
		.values({
			billing_id: Number(get_billing?.id),
			charge_on: 'imagerie',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	await db
		.insert(charge)
		.values({
			billing_id: get_billing!.id,
			charge_on: 'laboratory',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	await db
		.insert(charge)
		.values({
			billing_id: get_billing!.id,
			charge_on: 'prescription',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	await db
		.insert(charge)
		.values({
			billing_id: get_billing!.id,
			charge_on: 'service',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
	await db
		.insert(charge)
		.values({
			billing_id: get_billing!.id,
			charge_on: 'vaccine',
			created_at: created_at
		})
		.catch((e) => {
			logErrorMessage(e);
		});
};
