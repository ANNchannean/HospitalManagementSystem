import { db } from '$lib/server/db';
import {
	operationProtocol,
	product,
	productGroupType,
	productOrder,
	service,
	visit
} from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Service')
	});
	const get_product_as_service = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0)
	});
	const get_services = await db.query.service.findMany({
		where: eq(service.visit_id, +visit_id),
		with: {
			product: true,
			operationProtocol: true
		}
	});
	return {
		get_product_as_service,
		get_services
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_service_operation: async ({ request, params }) => {
		const { id } = params;
		const body = await request.formData();
		const visti_id = parseInt(params.id);
		const { product_id } = Object.fromEntries(body) as Record<string, string>;
		if (!product_id) return fail(400, { errId: true });
		const get_product = await db.query.product.findFirst({ where: eq(product.id, +product_id) });
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
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
				service: true
			}
		});

		if (get_visit?.service.some((e) => e.product_id === +product_id))
			return fail(400, { errId: true });
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
		await db.insert(service).values({
			product_id: get_product?.id,
			visit_id: visti_id
		});
		await db
			.insert(productOrder)
			.values({
				charge_id: charge_on_service!.id,
				product_id: get_product!.id,
				price: get_product?.price,
				total: get_product?.price,
				created_at: now_datetime()
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_service: async ({ request, params }) => {
		const { id: visit_id } = params;
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		if (!id) return fail(400, { errId: true });
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
		const get_services = await db.query.service.findFirst({
			where: eq(service.id, +id),
			with: {
				product: true
			}
		});
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
		const get_product_order = charge_on_service?.productOrder.find(
			(e) => e.product_id === get_services?.product_id
		);
		if (get_product_order) {
			await db.delete(productOrder).where(eq(productOrder.id, get_product_order!.id));
		}
		await db.delete(service).where(eq(service.id, +id));
	},
	create_protocol: async ({ request }) => {
		const body = await request.formData();
		const {
			surgeon,
			assistant_surgeon,
			anesthetist,
			assistant_anesthetist,
			scrub_nurse,
			cirulating_nurse_block,
			midwife,
			date,
			start_time,
			finish_time,
			pre_diagnosis,
			post_diagnosis,
			type_anesthesia,
			opertive_technique,
			blood_less,
			notes,
			service_id
		} = Object.fromEntries(body) as Record<string, string>;
		const get_operation_protocol = await db.query.operationProtocol.findFirst({
			where: eq(operationProtocol.service_id, +service_id)
		});

		if (get_operation_protocol) {
			await db
				.update(operationProtocol)
				.set({
					anesthetist: anesthetist,
					assistant_anesthetist: assistant_anesthetist,
					assistant_surgeon: assistant_surgeon,
					blood_less: blood_less,
					cirulating_nurse_block: cirulating_nurse_block,
					date: date,
					finish_time: finish_time,
					midwife: midwife,
					notes: notes,
					opertive_technique: opertive_technique,
					post_diagnosis: post_diagnosis,
					pre_diagnosis: pre_diagnosis,
					scrub_nurse: scrub_nurse,
					start_time: start_time,
					surgeon: surgeon,
					type_anesthesia: type_anesthesia
				})
				.where(eq(operationProtocol.service_id, +service_id))
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		} else {
			await db
				.insert(operationProtocol)
				.values({
					anesthetist: anesthetist,
					assistant_anesthetist: assistant_anesthetist,
					assistant_surgeon: assistant_surgeon,
					blood_less: blood_less,
					cirulating_nurse_block: cirulating_nurse_block,
					date: date,
					finish_time: finish_time,
					midwife: midwife,
					notes: notes,
					opertive_technique: opertive_technique,
					post_diagnosis: post_diagnosis,
					pre_diagnosis: pre_diagnosis,
					scrub_nurse: scrub_nurse,
					service_id: +service_id,
					start_time: start_time,
					surgeon: surgeon,
					type_anesthesia: type_anesthesia
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
	}
};
