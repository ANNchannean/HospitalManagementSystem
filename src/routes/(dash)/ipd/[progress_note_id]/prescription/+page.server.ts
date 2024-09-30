import { db } from '$lib/server/db';
import { presrciption, product, progressNote, unit } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { createProductOrder, deleteProductOrder, updateProductOrder } from '$lib/server/models';

export const load = (async ({ params }) => {
	const { progress_note_id } = params;
	const get_progress_note = await db.query.visit.findFirst({
		where: eq(progressNote.id, Number(progress_note_id)),
		with: {
			presrciption: {
				with: {
					product: {
						with: {
							productGroupType: true,
							unit: true
						}
					}
				}
			}
		}
	});
	const get_uses = await db.query.use.findMany({});
	const get_durations = await db.query.duration.findMany({});
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
	return {
		get_progress_note,
		get_products,
		get_units_as_medicine,
		get_uses,
		get_durations
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	paste_prescription: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const product_id = body.getAll('product_id');
		const use = body.getAll('use');
		const amount = body.getAll('amount');
		const duration = body.getAll('duration');
		const morning = body.getAll('morning');
		const noon = body.getAll('noon');
		const afternoon = body.getAll('afternoon');
		const evening = body.getAll('evening');
		const night = body.getAll('night');
		for (let index = 0; index < product_id.length; index++) {
			const product_id_ = +product_id[index];
			const use_ = use[index].toString();
			const amount_ = +amount[index];
			const duration_ = duration[index].toString();
			const morning_ = +morning[index];
			const noon_ = +noon[index];
			const afternoon_ = +afternoon[index];
			const evening_ = +evening[index];
			const night_ = +night[index];
			const [get_product, get_progress_note] = await Promise.all([
				db.query.product.findFirst({ where: eq(product.id, +product_id_) }),
				db.query.progressNote.findFirst({
					where: eq(progressNote.id, +progress_note_id),
					with: {
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
				})
			]);
			const charge_on_prescription = get_progress_note?.billing?.charge.find(
				(e) => e.charge_on === 'prescription'
			);

			const check_the_same_product_id = charge_on_prescription?.productOrder.some(
				(e) => e.product_id === product_id_
			);
			const find_prescription = get_progress_note?.presrciption.some(
				(e) => e.product_id === product_id_
			);
			if (!check_the_same_product_id) {
				if (!get_progress_note) {
					await createProductOrder({
						charge_id: charge_on_prescription!.id,
						product_id: +product_id_,
						price: +get_product!.price,
						qty: +amount_
					});
				}
			}
			if (!find_prescription) {
				await db
					.insert(presrciption)
					.values({
						amount: +amount_,
						duration: duration_,
						product_id: +product_id_,
						use: use_,
						progress_note_id: +progress_note_id,
						morning: +morning_,
						noon: +noon_,
						afternoon: +afternoon_,
						evening: +evening_,
						night: +night_
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
	},
	create_prescription: async ({ request, params }) => {
		const { progress_note_id } = params;
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
		const get_progress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +progress_note_id),
			with: {
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
		if (get_progress_note?.presrciption.some((e) => e.product_id === +product_id)) {
			validErr.product_id = true;
		}
		const charge_on_prescription = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		if (charge_on_prescription?.productOrder.some((e) => e.product_id === +product_id))
			validErr.product_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);

		await createProductOrder({
			charge_id: charge_on_prescription!.id,
			product_id: +product_id,
			price: +get_product!.price,
			qty: +amount
		});

		await db
			.insert(presrciption)
			.values({
				amount: +amount,
				duration: duration,
				product_id: +product_id,
				use: use,
				progress_note_id: +progress_note_id,
				morning: +morning,
				noon: +noon,
				afternoon: +afternoon,
				evening: +evening,
				night: +night
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_prescription: async ({ request, params }) => {
		const { progress_note_id } = params;
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
		const get_progress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +progress_note_id),
			with: {
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
		const charge_on_prescription = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		const get_product_order = charge_on_prescription?.productOrder.find(
			(e) => e.product_id === +product_id
		);
		if (get_product_order && !get_progress_note?.id) {
			await updateProductOrder({
				disc: '',
				price: Number(get_product_order?.price),
				qty: +amount,
				product_order_id: get_product_order!.id
			});
		}
		await db
			.update(presrciption)
			.set({
				amount: +amount,
				duration: duration,
				product_id: +product_id,
				use: use,
				progress_note_id: +progress_note_id,
				morning: +morning,
				noon: +noon,
				afternoon: +afternoon,
				evening: +evening,
				night: +night
			})
			.where(eq(presrciption.id, +prescription_id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_prescription: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const id = body.get('id') ?? '';
		const get_prescription = await db.query.presrciption.findFirst({
			where: eq(presrciption.id, +id)
		});
		const get_progress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +progress_note_id),
			with: {
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
		const charge_on_prescription = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		const get_product_order = charge_on_prescription?.productOrder.find(
			(e) => e.product_id === get_prescription?.product_id
		);
		if (get_product_order) {
			await deleteProductOrder(get_product_order!.id);
		}
		await db
			.delete(presrciption)
			.where(eq(presrciption.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
