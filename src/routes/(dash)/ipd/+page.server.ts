import { db } from '$lib/server/db';
import { department, staff, patient, visit, progressNote, room } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({ url, parent }) => {
	await parent();
	const patient_id = url.searchParams.get('patient_id') ?? '';
	if (!url.searchParams.has('patient_id')) redirect(303, '/patient/opd');
	const visit_id = url.searchParams.get('visit_id') ?? '';
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, +visit_id),
		with: {
			vitalSign: true
		}
	});
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
	const get_wards = await db.query.ward.findMany({
		with: {
			room: {
				where: eq(room.status, false)
			}
		}
	});
	const get_words = await db.query.words.findMany();
	return {
		get_patient,
		get_staffs,
		get_departments,
		get_words,
		get_wards,
		get_visit
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_visit_ipd: async ({ request }) => {
		const body = await request.formData();
		const created_at = now_datetime();
		const { patient_id, staff_id, department_id, etiology, room_id, visit_id } = Object.fromEntries(
			body
		) as Record<string, string>;
		const validErr = {
			patient_id: false,
			staff_id: false,
			department_id: false,
			etiology: false,
			room_id: false
		};
		if (!room_id) validErr.room_id = true;
		if (!etiology) validErr.etiology = true;
		if (!patient_id) validErr.patient_id = true;
		if (!department_id) validErr.department_id = true;
		if (!staff_id) validErr.staff_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const progress_note_id = await db
			.insert(progressNote)
			.values({
				date_checkup: created_at,
				patient_id: +patient_id,
				room_id: +room_id
			})
			.$returningId();

		if (visit_id) {
			await db
				.update(visit)
				.set({
					transfer: true,
					progress_note_id: progress_note_id[0].id
				})
				.where(eq(visit.id, +visit_id))
				.catch((e) => {
					logErrorMessage(e);
				});
		} else {
			await db
				.insert(visit)
				.values({
					checkin_type: 'IPD',
					patient_id: Number(patient_id),
					date_checkup: created_at,
					staff_id: Number(staff_id),
					department_id: Number(department_id),
					etiology: etiology,
					progress_note_id: progress_note_id[0].id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}

		await db.update(room).set({ status: true }).where(eq(room.id, +room_id));
		redirect(303, `/ipd/${progress_note_id[0].id}/progress-note`);
	}
};
