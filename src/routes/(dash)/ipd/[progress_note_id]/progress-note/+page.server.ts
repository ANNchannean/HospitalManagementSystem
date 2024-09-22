import { db } from '$lib/server/db';
import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import {
	activePresrciption,
	laboratoryResult,
	parameter,
	presrciption,
	progressNote,
	staff,
	visit
} from '$lib/server/schemas';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import {
	createProductOrder,
	deleteProductOrder,
	preBilling,
	updateProductOrder
} from '$lib/server/models';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const get_currency = await db.query.currency.findFirst({});
	const progress_note_id = params.progress_note_id;
	const get_staffs = await db.query.staff.findMany({
		orderBy: asc(staff.name)
	});

	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, +progress_note_id),
		with: {
			visit: {
				with: {
					adviceTeaching:true,
					billing: {
						with: {
							charge: true
						}
					},
					service: {
						with: {
							operationProtocol: true,
							product: true
						}
					},
					accessment: true,
					remark: true,
					presrciption: {
						with: {
							product: {
								with: {
									unit: true
								}
							},
							activePresrciption: {
								with: {
									user: true
								}
							}
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
					imagerieRequest: {
						with: {
							product: true,
							fileOrPicture: true
						}
					},
					subjective: true,
					physicalExam: {
						with: {
							physical: {
								with: {
									exam: true
								}
							}
						}
					},
					vitalSign: true
				},
				orderBy: desc(visit.date_checkup)
			},
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			}
		}
	});
	const removeDuplicateDate = get_progress_note?.visit.filter(
		(value, index, selt) =>
			index ===
			selt.findIndex(
				(t) =>
					new Date(t.date_checkup ?? '').toDateString() ===
					new Date(value.date_checkup ?? '').toDateString()
			)
	);
	const get_exams = await db.query.exam.findMany({
		with: {
			physical: true
		}
	});
	return {
		get_progress_note,
		get_staffs,
		removeDuplicateDate,
		get_exams,
		visit: get_progress_note?.visit[0],
		get_currency
	};
};

export const actions: Actions = {
	create_visit_ipd: async ({ request, params }) => {
		const progress_note_id = params.progress_note_id;
		const body = await request.formData();
		const created_at = now_datetime();
		const { staff_id } = Object.fromEntries(body) as Record<string, string>;
		const get_pregress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.id, +progress_note_id)
		});
		let visit_id: number = 0;
		try {
			const id = await db
				.insert(visit)
				.values({
					checkin_type: 'IPD',
					patient_id: Number(get_pregress_note?.patient_id),
					date_checkup: created_at,
					staff_id: Number(staff_id),
					progress_note_id: +progress_note_id,
					etiology: get_pregress_note?.etiology ?? '',
					department_id: Number(get_pregress_note?.department_id)
				})
				.$returningId();
			visit_id = id[0].id;
		} catch (error) {
			logErrorMessage(String(error));
		}
		if (visit_id > 0) {
			await preBilling({
				visit_id: visit_id,
				progress_id: null,
				checkin_type: 'IPD',
				patient_id: Number(get_pregress_note?.patient_id)
			});
		}
	},
	delete_visit_ipd: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(visit)
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	active_prescription: async ({ request, locals }) => {
		const { user } = locals;
		const body = await request.formData();
		const { prescription_id, active_for } = Object.fromEntries(body) as Record<string, string>;
		const datetime = now_datetime();
		const validErr = {
			prescription_id: false,
			active_for: false
		};
		if (!prescription_id || isNaN(+prescription_id)) validErr.prescription_id = true;
		if (!active_for) validErr.active_for = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_prescription = await db.query.presrciption.findFirst({
			where: eq(presrciption.id, +prescription_id),
			with: {
				product: true
			}
		});
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, Number(get_prescription?.visit_id)),
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
				presrciption: true
			}
		});
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		await createProductOrder({
			charge_id: Number(charge_on_prescription?.id),
			price: Number(get_prescription?.product?.price),
			product_id: Number(get_prescription?.product_id)
		});
		await db.insert(activePresrciption).values({
			active_for: active_for,
			presrciption_id: +prescription_id,
			datetime: datetime,
			user_id: user?.id
		});
	},
	add: async ({ request, locals }) => {
		const { user } = locals;
		const body = await request.formData();

		const { prescription_id, active_for } = Object.fromEntries(body) as Record<string, string>;
		const datetime = now_datetime();
		const validErr = {
			prescription_id: false,
			active_for: false
		};
		if (!prescription_id || isNaN(+prescription_id)) validErr.prescription_id = true;
		if (!active_for) validErr.active_for = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_prescription = await db.query.presrciption.findFirst({
			where: eq(presrciption.id, +prescription_id),
			with: {
				product: true
			}
		});
		await db
			.update(presrciption)
			.set({
				amount: Number(get_prescription?.amount) + 1
			})
			.where(eq(presrciption.id, +prescription_id));
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, Number(get_prescription?.visit_id)),
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
				presrciption: true
			}
		});
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		await createProductOrder({
			charge_id: Number(charge_on_prescription?.id),
			price: Number(get_prescription?.product?.price),
			product_id: Number(get_prescription?.product_id)
		});
		await db.insert(activePresrciption).values({
			active_for: active_for,
			presrciption_id: +prescription_id,
			datetime: datetime,
			user_id: user?.id
		});
	},
	remove: async ({ request }) => {
		const body = await request.formData();
		const { prescription_id, active_for } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			prescription_id: false,
			active_for: false
		};
		if (!prescription_id || isNaN(+prescription_id)) validErr.prescription_id = true;
		if (!active_for) validErr.active_for = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const get_prescription = await db.query.presrciption.findFirst({
			where: eq(presrciption.id, +prescription_id),
			with: {
				product: true,
				activePresrciption: true
			}
		});

		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, Number(get_prescription?.visit_id)),
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
		const charge_on_prescription = get_visit?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		const get_product_order = charge_on_prescription?.productOrder.find(
			(e) => e.product_id === get_prescription?.product_id
		);
		const find_active_prescription = get_prescription?.activePresrciption.filter(
			(e) => e.active_for === active_for
		);

		if (Number(find_active_prescription?.length) > 1) {
			await db
				.update(presrciption)
				.set({
					amount: Number(get_prescription?.amount) - 1
				})
				.where(eq(presrciption.id, +prescription_id));
		}
		await updateProductOrder({
			disc: get_product_order?.discount ?? '',
			price: Number(get_product_order?.price),
			product_order_id: Number(get_product_order?.id),
			qty: Number(get_product_order?.qty) - 1
		});
		if (Number(get_prescription?.activePresrciption.length) === 1) {
			deleteProductOrder(Number(get_product_order?.id));
		}
		const active_prescription_id = find_active_prescription?.at(-1)?.id;
		if (active_prescription_id) {
			await db.delete(activePresrciption).where(eq(activePresrciption.id, active_prescription_id));
		}
	}
};
