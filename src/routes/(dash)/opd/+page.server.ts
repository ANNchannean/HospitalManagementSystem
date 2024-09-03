import { db } from '$lib/server/db';
import { department, staff, patient, visit, vitalSign, subjective } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { preBilling } from '$lib/server/models';

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
	const get_words = await db.query.words.findMany();
	return {
		get_patient,
		get_staffs,
		get_departments,
		get_words
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_visit_opd: async ({ request }) => {
		const body = await request.formData();
		const created_at = now_datetime();
		const {
			patient_id,
			staff_id,
			department_id,
			etiology,
			pulse,
			t,
			sp02,
			height,
			weight,
			bmi,
			sbp,
			dbp,
			rr,
			asign_vitalsing,
			assign_subjective,
			cheif_complaint,
			history_of_present_illness,
			past_medical_history,
			allesgy_medicine,
			surgical_history,
			current_medication,
			family_and_social_history
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			bmi: false,
			etiology: false,
			patient_id: false,
			department_id: false,
			staff_id: false
		};
		if (!bmi) validErr.bmi = true;
		if (!etiology) validErr.etiology = true;
		if (!patient_id) validErr.patient_id = true;
		if (!department_id) validErr.department_id = true;
		if (!staff_id) validErr.staff_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		let visit_id: number = 0;
		try {
			const id = await db
				.insert(visit)
				.values({
					checkin_type: 'OPD',
					patient_id: Number(patient_id),
					date_checkup: created_at,
					staff_id: Number(staff_id),
					department_id: Number(department_id),
					etiology: etiology
				})
				.$returningId();
			visit_id = id[0].id;
		} catch (error) {
			logErrorMessage(String(error));
		}

		if (visit_id <= 0) return fail(400, { visit_id: true });
		if (visit_id > 0) {
			// doing billing
			await preBilling({ visit_id: visit_id, progress_id: undefined, checkin_type: 'IPD' });

			// creae vital sign
			if (asign_vitalsing === 'on') {
				await db
					.insert(vitalSign)
					.values({
						bmi: +bmi,
						rr: +rr,
						height: +height,
						weight: +weight,
						pulse: +pulse,
						sp02: +sp02,
						t: +t,
						visit_id: +visit_id,
						sbp: +sbp,
						dbp: +dbp
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}

			if (assign_subjective === 'on') {
				await db
					.insert(subjective)
					.values({
						allesgy_medicine: allesgy_medicine,
						cheif_complaint: cheif_complaint,
						past_medical_history: past_medical_history,
						history_of_present_illness: history_of_present_illness,
						surgical_history: surgical_history,
						visit_id: +visit_id,
						current_medication: current_medication,
						family_and_social_history: family_and_social_history
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}

		redirect(303, '/patient/opd');
	}
};
