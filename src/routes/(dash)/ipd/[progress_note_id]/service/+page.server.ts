import { db } from '$lib/server/db';
import {
	operationProtocol,
	product,
	productGroupType,
	progressNote,
	service
} from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import {
	createProductOrder,
	deleteProductOrder,
	setChargePrice,
	updateProductOrder
} from '$lib/server/models';
export const load = (async ({ params }) => {
	const { progress_note_id } = params;

	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'Service')
	});
	const get_product_as_service = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0)
	});
	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, +progress_note_id),
		with: {
			visit: {
				with: {
					billing: true
				}
			},
			billing: {
				with: {
					payment: true,
					charge: {
						with: {
							productOrder: true
						}
					}
				}
			},
			service: {
				with: {
					product: true,
					operationProtocol: true
				}
			}
		}
	});
	const charge_on_service = get_progress_note?.billing?.charge.find(
		(e) => e.charge_on === 'service'
	);
	const get_currency = await db.query.currency.findFirst({});
	return {
		get_product_as_service,
		get_progress_note: get_progress_note,
		charge_on_service: charge_on_service,
		get_currency: get_currency
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_service_operation: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const { product_id } = Object.fromEntries(body) as Record<string, string>;
		if (!product_id) return fail(400, { errId: true });
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
				service: true
			}
		});
		if (get_progress_note?.service.find((e) => e.product_id === +product_id)) {
			return fail(400, { errId: true });
		}
		const charge_on_service = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'service'
		);
		await db.insert(service).values({
			product_id: get_product?.id,
			progress_note_id: get_progress_note!.id
		});

		await createProductOrder({
			charge_id: charge_on_service!.id,
			product_id: get_product!.id,
			price: get_product?.price ?? 0,
			qty: 1
		});
	},
	delete_service: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		if (!id) return fail(400, { errId: true });
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
				service: true
			}
		});
		const get_services = await db.query.service.findFirst({
			where: eq(service.id, +id),
			with: {
				product: true
			}
		});
		const charge_on_service = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'service'
		);
		const get_product_order = charge_on_service?.productOrder.find(
			(e) => e.product_id === get_services?.product_id
		);
		if (get_product_order) {
			await deleteProductOrder(get_product_order!.id);
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
		const { progress_note_id } = params;
		const body = await request.formData();
		const { total_service } = Object.fromEntries(body) as Record<string, string>;
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
				service: true
			}
		});
		const charge_on_service = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'service'
		);
		if (charge_on_service) {
			await setChargePrice(charge_on_service.id, +total_service);
		}
	},
	set_price_service: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const { product_id, price } = Object.fromEntries(body) as Record<string, string>;
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
				service: true
			}
		});
		const charge_on_service = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'service'
		);
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
