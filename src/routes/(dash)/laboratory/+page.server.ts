import { db } from '$lib/server/db';
import {
	charge,
	fileOrPicture,
	laboratory,
	laboratoryRequest,
	laboratoryResult,
	parameter,
	product,
	productOrder,
	visit
} from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, desc, eq } from 'drizzle-orm';
import { deleteFile, uploadFile } from '$lib/server/fileHandle';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
export const load = (async ({ parent }) => {
	await parent();
	const get_visits = await db.query.visit.findMany({
		with: {
			billing: true,
			laboratory: {
				with: {
					fileOrPicture: true
				}
			},
			laboratoryRequest: {
				with: {
					product: {
						with: {
							parameter: {
								with: {
									unit: true,
									laboratoryResult: true
								},
								orderBy: asc(parameter.id)
							}
						}
					},
					laboratoryResult: true
				},
				orderBy: desc(laboratoryResult.id)
			},
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			},
			staff: true
		},
		orderBy: desc(visit.id)
	});

	const get_laboratory_group = await db.query.laboratoryGroup.findMany({
		with: {
			product: {
				orderBy: asc(product.products)
			}
		}
	});
	return {
		get_visits,
		get_laboratory_group
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_laboratory_request: async ({ request }) => {
		const body = await request.formData();
		const visit_id = body.get('visit_id') ?? '';
		const product_id = body.getAll('product_id');
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: {
				laboratory: true,
				laboratoryRequest: {
					with: {
						laboratoryResult: {
							with: {
								parameter: true
							}
						}
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
		const charge_on_laboratory = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'laboratory'
		);
		for (const e of product_id) {
			const is_created = get_visit?.laboratoryRequest.find((ee) => ee.product_id === +e);
			if (!is_created) {
				const get_product = await db.query.product.findFirst({
					where: eq(product.id, +e)
				});
				await db
					.insert(laboratoryRequest)
					.values({
						product_id: +e,
						visit_id: get_visit?.id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
				await db
					.insert(productOrder)
					.values({
						created_at: now_datetime(),
						charge_id: charge_on_laboratory!.id,
						product_id: +e,
						price: get_product!.price
					})
					.catch((e) => {
						logErrorMessage(e);
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
			}
		}
		for (const e of get_visit!.laboratoryRequest) {
			const is_created = product_id.find((ee) => +ee === e.product_id);
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
				await db
					.delete(productOrder)
					.where(eq(productOrder.id, product_order_!.id))
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
		const get_charge = await db.query.charge.findFirst({
			where: eq(charge.id, charge_on_laboratory!.id),
			with: {
				productOrder: true
			}
		});
		const total_charge_on_imagerie = get_charge?.productOrder.reduce(
			(store, e) => store + Number(e.price),
			0
		);
		await db
			.update(charge)
			.set({
				price: total_charge_on_imagerie
			})
			.where(eq(charge.id, charge_on_laboratory!.id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	create_laboratory_result: async ({ request }) => {
		const body = await request.formData();
		const laboratory_result = body.getAll('laboratory_result') as string[];
		const parameter_id = body.getAll('parameter_id') as string[];
		const file = body.getAll('file') as File[];
		const visit_id = body.get('visit_id') as string;
		const sample = body.get('sample') as string;
		const doctor_comment = (body.get('doctor_comment') as string) ?? '';
		const laboratory_result_id = body.getAll('laboratory_result_id') as string[];
		const laboratory_request_id = body.getAll('laboratory_request_id') as string[];

		for (let index = 0; index < parameter_id.length; index++) {
			const parameterId = parameter_id[index] ?? '';
			const result = laboratory_result[index] ?? '';
			const laboratory_request_id_ = laboratory_request_id[index] ?? '';
			const laboratory_resultId = laboratory_result_id[index] ?? '';
			if (laboratory_resultId) {
				await db
					.update(laboratoryResult)
					.set({
						parameter_id: +parameterId,
						laboratory_request_id: +laboratory_request_id_,
						result: result.toString()
					})
					.where(eq(laboratoryResult.id, +laboratory_resultId))
					.catch((e) => {
						logErrorMessage(e);
					});
			}
			if (!laboratory_resultId) {
				await db
					.insert(laboratoryResult)
					.values({
						parameter_id: +parameterId,
						laboratory_request_id: +laboratory_request_id_,
						result: result.toString()
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}

		const check_request = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id || 0),
			with: {
				laboratoryRequest: {
					with: {
						laboratoryResult: true
					}
				},
				laboratory: true
			}
		});
		//aposite condition
		const isReqAndRes = check_request?.laboratoryRequest.some((e) =>
			e.laboratoryResult.some((ee) => ee.result === '' || ee.result === null)
		);
		if (check_request?.laboratory?.id) {
			await db
				.update(laboratory)
				.set({
					status: !isReqAndRes,
					doctor_comment: doctor_comment,
					visit_id: check_request?.id,
					sample: sample,
					finish_datetime: !isReqAndRes ? now_datetime() : undefined
				})
				.where(eq(laboratory.id, check_request.laboratory.id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (!check_request?.laboratory?.id) {
			await db
				.insert(laboratory)
				.values({
					status: !isReqAndRes,
					doctor_comment: doctor_comment,
					visit_id: check_request?.id,
					sample: sample,
					finish_datetime: !isReqAndRes ? now_datetime() : undefined
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		for (const e of file) {
			if (e.size) {
				const filename = await uploadFile(e);
				await db
					.insert(fileOrPicture)
					.values({
						filename: filename,
						lastModified: e.lastModified,
						mimeType: e.type,
						size: e.size,
						laboratory_id: check_request?.laboratory?.id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
	},
	delete_picture: async ({ request }) => {
		const body = await request.formData();
		const { file_name } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(fileOrPicture)
			.where(eq(fileOrPicture.filename, file_name))
			.catch((e) => {
				logErrorMessage(e);
			});
		await deleteFile(file_name);
	}
};
