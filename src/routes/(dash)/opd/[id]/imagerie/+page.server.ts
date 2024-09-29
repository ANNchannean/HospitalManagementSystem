import { db } from '$lib/server/db';
import { imagerieRequest, product, visit } from '$lib/server/schemas';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { createProductOrder, deleteProductOrder } from '$lib/server/models';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ params }) => {
	const get_currency = await db.query.currency.findFirst({});
	const get_imageerie_groups = await db.query.imagerieGroup.findMany({
		with: {
			product: {
				orderBy: asc(product.products)
			}
		}
	});
	const get_visit = await db.query.visit.findFirst({
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
		},
		where: eq(visit.id, +params.id)
	});

	return {
		get_imageerie_groups,
		get_visit,
		get_currency
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	create_imagerie_request: async ({ request, params }) => {
		const visit_id = parseInt(params.id);
		const body = await request.formData();
		const product_id = body.getAll('product_id');
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, visit_id),
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

		// Create Imagerie Request
		const charge_on_imagerie = get_visit?.billing?.charge.find((e) => e.charge_on === 'imagerie');
		for (const e of product_id) {
			const is_created = get_visit?.imagerieRequest.some((ee) => ee.product_id === +e);
			if (!is_created) {
				const get_product = await db.query.product.findFirst({
					where: eq(product.id, +e)
				});
				await db
					.insert(imagerieRequest)
					.values({
						product_id: +e,
						visit_id: get_visit?.id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
				await createProductOrder({
					charge_id: Number(charge_on_imagerie?.id),
					price: Number(get_product?.price),
					product_id: Number(get_product?.id),
					qty: 1
				});
			}
		}

		// Delete Imagere Request
		for (const e of get_visit!.imagerieRequest) {
			const is_created = product_id.some((ee) => +ee === e.product_id);
			if (!is_created) {
				const product_order_ = charge_on_imagerie?.productOrder.find(
					(ee) => ee.product_id === e.product_id
				);
				await db
					.delete(imagerieRequest)
					.where(eq(imagerieRequest.id, e.id))
					.catch((e) => {
						logErrorMessage(e);
					});
				await deleteProductOrder(Number(product_order_?.id));
			}
		}
	}
};
