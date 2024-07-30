import { db } from '$lib/server/db';
import { department, staff, patient, visit, billing, charge, vitalSign } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';

export const load = (async ({ url,parent }) => {
	await parent()
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
		if (!bmi) return fail(400, { bmi: true });
		await db
			.insert(visit)
			.values({
				checkin_type: 'OPD',
				patient_id: Number(patient_id),
				date_checkup: created_at,
				staff_id: Number(staff_id),
				department_id: Number(department_id),
				etiology: etiology
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});

		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.date_checkup, created_at)
		});
		if (!get_visit) return fail(400, { visit_id: true });
		if (get_visit) {
			// doing billing
			await db
				.insert(billing)
				.values({
					created_at: created_at,
					visit_id: get_visit?.id,
					checkin_type: 'OPD',
					tax: get_tax?.value || 0
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
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
					console.log(e);
					return fail(500, { serverError: true });
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'imagerie',
					created_at: created_at
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'laboratory',
					created_at: created_at
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'prescription',
					created_at: created_at
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
			await db
				.insert(charge)
				.values({
					billing_id: get_billing!.id,
					charge_on: 'service',
					created_at: created_at
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
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
						visit_id: get_visit!.id,
						sbp: +sbp,
						dbp: +dbp
					})
					.catch((e) => {
						console.log(e);
						return fail(500, { serverError: true });
					});
			}
		}
		redirect(303, '/patient/opd');
	}
};
