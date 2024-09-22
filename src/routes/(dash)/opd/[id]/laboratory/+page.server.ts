import { db } from '$lib/server/db';
import { laboratory, laboratoryRequest, product, visit } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { createProductOrder, deleteProductOrder, updatChargeByValue } from '$lib/server/models';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
export const load = (async ({ params }) => {
	const id = parseInt(params.id);
	const get_currency = await db.query.currency.findFirst({});
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
			}
		},
		where: eq(visit.id, +id)
	});
	const get_laboratory_group = await db.query.laboratoryGroup.findMany({
		with: {
			product: {
				orderBy: asc(product.products)
			}
		}
	});
	return {
		get_laboratory_group,
		get_visit,
		get_currency
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_laboratory_request: async ({ request, params }) => {
		const id = parseInt(params.id);
		const body = await request.formData();
		const product_id = body.getAll('product_id');
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
			with: {
				laboratoryRequest: true,
				laboratory: true,
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
		const charge_on_laboratory = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'laboratory'
		);
		for (const e of product_id) {
			const is_created = get_visit?.laboratoryRequest.some((ee) => ee.product_id === +e);
			if (!is_created) {
				const get_product = await db.query.product.findFirst({
					where: eq(product.id, +e)
				});
				await db.insert(laboratoryRequest).values({
					product_id: +e,
					visit_id: get_visit?.id
				});
				if (get_visit?.laboratory?.id) {
					await db
						.update(laboratory)
						.set({
							status: false,
							visit_id: get_visit?.id
						})
						.where(eq(laboratory.id, get_visit.laboratory.id))
						.catch((e) => {
							logErrorMessage(e);
						});
				}
				if (!get_visit?.laboratory?.id) {
					await db
						.insert(laboratory)
						.values({
							status: false,
							visit_id: get_visit?.id
						})
						.catch((e) => {
							logErrorMessage(e);
						});
				}
				await createProductOrder({
					charge_id: Number(charge_on_laboratory?.id),
					price: Number(get_product?.price),
					product_id: Number(+e)
				});
			}
		}
		for (const e of get_visit!.laboratoryRequest) {
			const is_created = product_id.some((ee) => +ee === e.product_id);
			if (!is_created) {
				const product_order_ = charge_on_laboratory?.productOrder.find(
					(ee) => ee.product_id === e.product_id
				);
				await db
					.delete(laboratoryRequest)
					.where(eq(laboratoryRequest.id, e.id))
					.catch((e) => {
						logErrorMessage(e);
					});

				await deleteProductOrder(Number(product_order_?.id)).catch((e) => {
					logErrorMessage(e);
				});
			}
		}
	},

	update_total_laboratory: async ({ request, params }) => {
		const { id } = params;
		const body = await request.formData();
		const { total_laboratory } = Object.fromEntries(body) as Record<string, string>;
		console.log(body);

		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
			with: {
				laboratoryRequest: true,
				laboratory: true,
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

		const charge_on_laboratory = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'laboratory'
		);
		if (charge_on_laboratory) {
			await updatChargeByValue(charge_on_laboratory.id, +total_laboratory);
		}
	}
};
