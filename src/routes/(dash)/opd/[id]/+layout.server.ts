import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { progressNote, visit } from '$lib/server/schema';
import { and, eq, ne } from 'drizzle-orm';
export const load: LayoutServerLoad = async ({ params, parent }) => {
	await parent();
	const visit_id = params.id;
	if (isNaN(+visit_id)) redirect(303, '/patient/all');
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id)),
		with: {
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			},
			department: true,
			staff: true,
			progressNote: true
		}
	});
	if (!get_visit) redirect(303, '/patient/all');
	const get_visits = await db.query.visit.findMany({
		where: and(
			ne(visit.id, get_visit.id),
			eq(visit.checkin_type, 'OPD'),
			eq(visit.transfer, false)
		),
		with: {
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
		}
	});
	const get_exams = await db.query.exam.findMany({
		with: {
			physical: true
		}
	});
	const get_progress_notes = await db.query.progressNote.findMany({
		where: eq(progressNote.patient_id, get_visit.patient_id)
	});

	return {
		get_visit,
		get_visits,
		get_progress_notes,
		get_exams
	};
};
