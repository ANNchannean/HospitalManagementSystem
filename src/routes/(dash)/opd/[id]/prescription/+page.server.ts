import { db } from '$lib/server/db';
import {
	adviceTeaching,
	duration,
	presrciption,
	product,
	productOrder,
	unit,
	use,
	visit
} from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id))
	});
	const get_uses = await db.query.use.findMany({});
	const get_durations = await db.query.duration.findMany({});
	const get_prescriptions = await db.query.presrciption.findMany({
		where: eq(presrciption.visit_id, +visit_id),
		with: {
			product: {
				with: {
					productGroupType: true,
					unit: true
				}
			}
		}
	});
	const get_units_as_medicine = await db.query.unit.findMany({
		where: eq(unit.product_group_type_id, 1)
	});
	const get_products = await db.query.product.findMany({
		where: eq(product.group_type_id, 1),
		with: {
			productGroupType: true,
			unit: true
		}
	});
	const get_advice_teaching = await db.query.adviceTeaching.findFirst({
		where: eq(adviceTeaching.visit_id, +visit_id)
	});
	return {
		get_visit,
		get_products,
		get_units_as_medicine,
		get_uses,
		get_prescriptions,
		get_advice_teaching,
		get_durations
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_prescription: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const { product_id, use, amount, duration, morning, noon, afternoon, evening, night } =
			Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			product_id: false,
			amount: false,
			price: false
		};

		if (!product_id || isNaN(+product_id)) validErr.product_id = true;
		if (!amount || isNaN(+amount)) validErr.amount = true;

		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_product = await db.query.product.findFirst({ where: eq(product.id, +product_id) });
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: {
				imagerieRequest: {
					with: {
						product: true
					}
				},
				billing: {
					with: {
						charge: {
							with: {
								productOrder: true
							}
						}
					}
				},
				presrciption: true
			}
		});
		if (get_visit?.presrciption.some((e) => e.product_id === +product_id))
			validErr.product_id = true;
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		await db.insert(productOrder).values({
			charge_id: charge_on_prescription!.id,
			product_id: +product_id,
			created_at: now_datetime(),
			price: get_product?.price,
			qty: +amount,
			total: Number(get_product?.price) * Number(amount)
		});
		await db
			.insert(presrciption)
			.values({
				amount: +amount,
				duration: duration,
				product_id: +product_id,
				use: use,
				visit_id: +visit_id,
				morning: +morning,
				noon: +noon,
				afternoon: +afternoon,
				evening: +evening,
				night: +night
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_prescription: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const {
			product_id,
			use,
			duration,
			amount,
			prescription_id,
			morning,
			noon,
			afternoon,
			evening,
			night
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			product_id: false,
			amount: false
		};
		if (!product_id || isNaN(+product_id)) validErr.product_id = true;
		if (!amount || isNaN(+amount)) validErr.amount = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: {
				imagerieRequest: {
					with: {
						product: true
					}
				},
				billing: {
					with: {
						charge: {
							with: {
								productOrder: true
							}
						}
					}
				}
			}
		});
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		const get_product_order = charge_on_prescription?.productOrder.find(
			(e) => e.product_id === +product_id
		);
		if (get_product_order) {
			await db
				.update(productOrder)
				.set({
					qty: +amount,
					total: Number(get_product_order?.price) * Number(amount)
				})
				.where(eq(productOrder.id, get_product_order!.id));
		}
		await db
			.update(presrciption)
			.set({
				amount: +amount,
				duration: duration,
				product_id: +product_id,
				use: use,
				visit_id: +visit_id,
				morning: +morning,
				noon: +noon,
				afternoon: +afternoon,
				evening: +evening,
				night: +night
			})
			.where(eq(presrciption.id, +prescription_id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_prescription: async ({ request, params }) => {
		const { id: visit_id } = params;
		const body = await request.formData();
		const id = body.get('id') ?? '';
		const get_prescription = await db.query.presrciption.findFirst({
			where: eq(presrciption.id, +id)
		});
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: {
				imagerieRequest: {
					with: {
						product: true
					}
				},
				billing: {
					with: {
						charge: {
							with: {
								productOrder: true
							}
						}
					}
				}
			}
		});
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		const get_product_order = charge_on_prescription?.productOrder.find(
			(e) => e.product_id === get_prescription?.product_id
		);
		if (get_product_order) {
			await db.delete(productOrder).where(eq(productOrder.id, get_product_order!.id));
		}
		await db
			.delete(presrciption)
			.where(eq(presrciption.id, +id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	create_advice_teaching: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const { advice_teaching } = Object.fromEntries(body) as Record<string, string>;
		const get_advice_teaching = await db.query.adviceTeaching.findFirst({
			where: eq(adviceTeaching.visit_id, +visit_id)
		});
		if (!get_advice_teaching) {
			await db
				.insert(adviceTeaching)
				.values({
					visit_id: +visit_id,
					description: advice_teaching
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
		if (get_advice_teaching) {
			await db
				.update(adviceTeaching)
				.set({
					description: advice_teaching
				})
				.where(eq(adviceTeaching.id, get_advice_teaching.id))
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
		redirect(303, '?');
	},
	create_use: async ({ request }) => {
		const body = await request.formData();
		const description = body.get('description')?.toString() ?? '';
		if (!description || description.trim().length == 0) return fail(400, { descriptionErr: true });
		await db.insert(use).values({
			description: description
		});
	},
	update_use: async ({ request }) => {
		const body = await request.formData();
		const description = body.get('description')?.toString() ?? '';
		const id = body.get('id')?.toString() ?? '';
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		if (!description || description.trim().length == 0) return fail(400, { descriptionErr: true });
		await db
			.update(use)
			.set({
				description: description
			})
			.where(eq(use.id, +id));
	},
	delete_use: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id')?.toString() ?? '';
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		await db.delete(use).where(eq(use.id, +id));
	},

	create_duration: async ({ request }) => {
		const body = await request.formData();
		const description = body.get('description')?.toString() ?? '';
		if (!description || description.trim().length == 0) return fail(400, { descriptionErr: true });
		await db.insert(duration).values({
			description: description
		});
	},
	update_duration: async ({ request }) => {
		const body = await request.formData();
		const description = body.get('description')?.toString() ?? '';
		const id = body.get('id')?.toString() ?? '';
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		if (!description || description.trim().length == 0) return fail(400, { descriptionErr: true });
		await db
			.update(duration)
			.set({
				description: description
			})
			.where(eq(duration.id, +id));
	},
	delete_duration: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id')?.toString() ?? '';
		if (!id || isNaN(+id)) return fail(400, { idErr: true });
		await db.delete(duration).where(eq(duration.id, +id));
	}
};
