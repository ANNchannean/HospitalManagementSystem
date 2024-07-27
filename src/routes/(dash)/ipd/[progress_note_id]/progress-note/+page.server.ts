import { db } from '$lib/server/db';
import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { progressNote, staff, visit } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';

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
					laboratoryRequest: {
						with: {
							laboratoryResult: true
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
					}
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
	let removeDuplicateDate = get_progress_note?.visit.filter(
		(value, index, selt) =>
			index ===
			selt.findIndex(
				(t) =>
					new Date(t.date_checkup ?? '').toDateString() ===
					new Date(value.date_checkup ?? '').toDateString()
			)
	);

	return {
		get_progress_note,
		get_staffs,
		removeDuplicateDate
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
		await db
			.insert(visit)
			.values({
				checkin_type: 'IPD',
				patient_id: Number(get_pregress_note?.patient_id),
				date_checkup: created_at,
				staff_id: Number(staff_id),
				progress_note_id: +progress_note_id
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_visit_ipd: async ({ request, params }) => {
		const progress_note_id = params.progress_note_id;
		const body = await request.formData();
		const created_at = now_datetime();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(visit)
			.where(eq(visit.id, +id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
