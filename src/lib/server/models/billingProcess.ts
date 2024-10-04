import { eq } from 'drizzle-orm';
import { db } from '../db';
import { billing } from '../schemas';
import { billingMessage } from '../telegram/billingMessage';
import { now_datetime } from '../utils';
type TBillingProcess = {
	billing_id: number;
	tax: number;
	disc: string;
	note: string;
};

export const billingProcess = async ({ billing_id, tax, disc, note }: TBillingProcess) => {
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
				status: 'debt',
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
				total_after_tax: total_after_tax,
				note: note,
				created_at: now_datetime()
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
			}).format(new Date(billing_?.created_at ?? ''))
		);

	billingMessage(message);
};
