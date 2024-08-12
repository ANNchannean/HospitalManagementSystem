import { db } from '$lib/server/db';
import { department, staff, patient, visit, progressNote } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url, parent }) => {
	await parent();
	const patient_id = url.searchParams.get('patient_id');
	const get_departments = await db.query.department.findMany({
		orderBy: asc(department.department)
	});
	const get_staffs = await db.query.staff.findMany({
		orderBy: asc(staff.name)
	});
	const get_patient = await db.query.patient.findFirst({
		where: eq(patient.id, Number(patient_id)),
		with: {
			provice: true,
			district: true,
			commune: true,
			village: true
		}
	});
	return {
		get_patient,
		get_staffs,
		get_departments
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_visit_ipd: async ({ request }) => {
		const body = await request.formData();
		const created_at = now_datetime();
		const { patient_id, staff_id, department_id, etiology } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		await db.insert(progressNote).values({
			date_checkup: created_at,
			patient_id: +patient_id
		});
		const get_pregress_note = await db.query.progressNote.findFirst({
			where: eq(progressNote.date_checkup, created_at)
		});
		await db
			.insert(visit)
			.values({
				checkin_type: 'IPD',
				patient_id: Number(patient_id),
				date_checkup: created_at,
				staff_id: Number(staff_id),
				department_id: Number(department_id),
				etiology: etiology,
				progress_note_id: get_pregress_note?.id
			})
			.catch((e) => {
				logErrorMessage(e);
			});
		redirect(303, `/ipd/${get_pregress_note?.id}/progress-note`);
	}
};
