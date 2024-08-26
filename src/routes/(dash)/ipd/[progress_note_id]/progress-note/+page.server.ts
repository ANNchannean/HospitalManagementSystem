import { db } from '$lib/server/db';
import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { laboratoryResult, parameter, progressNote, staff, visit } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { preBilling } from '$lib/server/models';

export const load: PageServerLoad = async ({ params }) => {
	const progress_note_id = params.progress_note_id;
	const get_staffs = await db.query.staff.findMany({
		orderBy: asc(staff.name)
	});

	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, +progress_note_id),
		with: {
			visit: {
				with: {
					billing:{
						with:{
							charge:true
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
		get_exams
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
		if (visit_id > 0) preBilling(visit_id);
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
	}
};
