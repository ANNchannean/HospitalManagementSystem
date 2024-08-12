import { db } from '$lib/server/db';
import { department, staff, patient, visit, billing, charge, vitalSign } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';

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
	create_visit_opd: async ({ request }) => {
		const body = await request.formData();
		const created_at = now_datetime();
		const get_tax = await db.query.tax.findFirst();
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
			asign_vitalsing
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
		if (visit_id <= 0) {
			// doing billing
			await db
				.insert(billing)
				.values({
					created_at: created_at,
					visit_id: visit_id,
					checkin_type: 'OPD',
					tax: get_tax?.value || 0
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			const get_billing = await db.query.billing.findFirst({
				where: eq(billing.created_at, created_at)
			});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'general',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'imagerie',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'laboratory',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'prescription',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'service',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'vaccine',
					created_at: created_at
				})
				.catch((e) => {
					logErrorMessage(e);
				});

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
						visit_id: visit_id,
						sbp: +sbp,
						dbp: +dbp
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
		redirect(303, '/patient/opd');
	}
};
