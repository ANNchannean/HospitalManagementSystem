import { db } from '$lib/server/db';
import { operationProtocol, product, productGroupType, service } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const visit_id = params.progress_note_id;
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
	create_service_general: async ({ request, params }) => {
		const body = await request.formData();
		const visti_id = parseInt(params.progress_note_id);
		const { product_id } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(service).values({
			product_id: +product_id,
			visit_id: visti_id
		});
	},
	create_service_operation: async ({ request, params }) => {
		const body = await request.formData();
		const visti_id = parseInt(params.progress_note_id);
		const { product_id } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(service).values({
			product_id: +product_id,
			visit_id: visti_id
		});
	},
	delete_service: async ({ request }) => {
		const body = await request.formData();

		const { id } = Object.fromEntries(body) as Record<string, string>;
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
