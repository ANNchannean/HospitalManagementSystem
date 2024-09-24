import { db } from '$lib/server/db';
import {
	operationProtocol,
	product,
	productGroupType,
	productOrder,
	service,
	visit
} from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { createProductOrder, updatChargeByValue, updateProductOrder } from '$lib/server/models';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	const get_visit = await db.query.visit.findFirst({
		with: {
			service: {
				with: {
					product: true,
					operationProtocol: true
				}
			},
			billing: {
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
			}
		},
		where: eq(visit.id, +visit_id)
	});
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Service')
	});
	const get_currency = await db.query.currency.findFirst({});

	const get_product_as_service = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0)
	});
	const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
	return {
		get_product_as_service,
		get_currency: get_currency,
		get_visit: get_visit,
		charge_on_service: charge_on_service
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
		if (get_visit?.service.find((e) => e.product_id === +product_id)) {
			return fail(400, { errId: true });
		}
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
		await db.insert(service).values({
			product_id: get_product?.id,
			visit_id: visti_id
		});
		await createProductOrder({
			charge_id: charge_on_service!.id,
			product_id: get_product!.id,
			price: get_product?.price ?? 0
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
			await db
				.delete(productOrder)
				.where(eq(productOrder.id, get_product_order!.id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		await db
			.delete(service)
			.where(eq(service.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
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
					logErrorMessage(e);
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
					logErrorMessage(e);
				});
		}
	},
	update_total_service: async ({ request, params }) => {
		const { id } = params;
		const body = await request.formData();
		const { total_service } = Object.fromEntries(body) as Record<string, string>;
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
			with: {
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
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
		if (charge_on_service) {
			await updatChargeByValue(charge_on_service.id, +total_service);
		}
	},
	set_price_service: async ({ request, params }) => {
		const { id } = params;
		const body = await request.formData();
		const { product_id, price } = Object.fromEntries(body) as Record<string, string>;
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +id),
			with: {
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
		const charge_on_service = get_visit?.billing?.charge.find((e) => e.charge_on === 'service');
		const find_product_order = charge_on_service?.productOrder.find(
			(e) => e.product_id === +product_id
		);
		if (find_product_order) {
			await updateProductOrder({
				disc: '',
				price: +price,
				product_order_id: find_product_order.id,
				qty: 1
			});
		}
	}
};
