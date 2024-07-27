import { db } from '$lib/server/db';
import { billing, charge, imagerieRequest, product, productOrder, visit } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { createProductOrder, deleteProductOrder } from '$lib/server/models';

export const load = (async ({ url, params }) => {
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
		get_visit
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
			let is_created = get_visit?.imagerieRequest.find((ee) => ee.product_id === +e);
			if (!is_created) {
				const get_product = await db.query.product.findFirst({
					where: eq(product.id, +e)
				});
				await db.insert(imagerieRequest).values({
					product_id: +e,
					visit_id: get_visit?.id
				});
				await createProductOrder({
					charge_id: Number(charge_on_imagerie?.id),
					price: Number(get_product?.price),
					product_id: Number(get_product?.id)
				});
			}
		}

		// Delete Imagere Request
		for (const e of get_visit!.imagerieRequest) {
			let is_created = product_id.find((ee) => +ee === e.product_id);
			if (!is_created) {
				const product_order_ = charge_on_imagerie?.productOrder.find(
					(ee) => ee.product_id === e.product_id
				);
				await db.delete(imagerieRequest).where(eq(imagerieRequest.id, e.id));
				await deleteProductOrder(Number(product_order_?.id));
			}
		}
	}
};
