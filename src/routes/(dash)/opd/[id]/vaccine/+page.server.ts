import { db } from '$lib/server/db';
import { injection, product, productGroupType, vaccine, visit } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { and, asc, eq } from 'drizzle-orm';
import { createProductOrder, deleteProductOrder } from '$lib/server/models';
import { now_datetime } from '$lib/server/utils';

export const load = (async ({ params }) => {
	const id = parseInt(params.id);
	const get_visit = await db.query.visit.findFirst({
		with: {
			laboratoryRequest: {
				with: {
					product: true
				}
			},
			patient: true,
			staff: true,
			billing: {
				with: {
					charge: true
				}
			},
			vaccine: {
				with: {
					product: true
				}
			}
		},
		where: eq(visit.id, +id)
	});
	const get_vaccine_group = await db.query.productGroupType.findFirst({
		with: {
			product: {
				orderBy: asc(product.products)
			}
		},
		where: eq(productGroupType.id, 3)
	});

	return {
		get_vaccine_group,
		get_visit
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	vaccine_service: async ({ request, params }) => {
		const id = parseInt(params.id);
		const body = await request.formData();
		const product_id = body.getAll('product_id');
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
			with: {
				vaccine: {
					with: {
						injection: true
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
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'vaccine');
		for (const e of product_id) {
			const is_created = get_visit?.vaccine.some((ee) => ee.product_id === +e);
			if (!is_created) {
				const get_injection = await db.query.injection.findFirst({
					where: and(eq(injection.patient_id, get_visit!.patient_id!), eq(injection.product_id, +e))
				});
				const get_product = await db.query.product.findFirst({
					where: eq(product.id, +e)
				});

				if (get_injection) {
					await db.insert(vaccine).values({
						visit_id: +get_visit!.id,
						product_id: get_product?.id,
						injection_id: get_injection.id
					});
				}
				if (!get_injection) {
					const injection_id = await db
						.insert(injection)
						.values({
							patient_id: get_visit?.patient_id,
							product_id: +e,
							datetime: now_datetime()
						})
						.$returningId();
					await db.insert(vaccine).values({
						visit_id: +get_visit!.id,
						product_id: get_product?.id,
						injection_id: injection_id[0].id
					});
				}

				await createProductOrder({
					charge_id: Number(charge_on_service?.id),
					price: Number(get_product?.price),
					product_id: Number(+e)
				});
			}
		}
		// Delete Vaccine Service
		for (const e of get_visit!.vaccine) {
			const is_created = product_id.some((ee) => +ee === e.product_id);
			if (!is_created) {
				const product_order_ = charge_on_service?.productOrder.find(
					(ee) => ee.product_id === e.product_id
				);
				await db.delete(vaccine).where(eq(vaccine.id, e.id));
				await deleteProductOrder(Number(product_order_?.id));
			}
		}
	}
};
