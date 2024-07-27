import { db } from '$lib/server/db';
import { accessment, visit } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ url, params }) => {
	const visit_id = params.id;
	const get_diagnosis = await db.query.diagnosis.findMany({});
	const get_diagnosisTypes = await db.query.diagnosisType.findMany({});
	const get_accessment = await db.query.accessment.findFirst({
		where: eq(accessment.visit_id, +visit_id)
	});
	return {
		get_diagnosis,
		get_diagnosisTypes,
		get_accessment
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_accessment: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const { diagnosis_differential, diagnosis } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const check_accessment = await db.query.accessment.findFirst({
			where: eq(accessment.visit_id, +visit_id)
		});
		if (check_accessment) {
			await db
				.update(accessment)
				.set({
					diagnosis_or_problem: diagnosis,
					differential_diagnosis: diagnosis_differential
				})
				.where(eq(accessment.id, check_accessment.id));
		}
		if (!check_accessment) {
			await db.insert(accessment).values({
				diagnosis_or_problem: diagnosis,
				differential_diagnosis: diagnosis_differential,
				visit_id: +visit_id
			});
		}
	}
};
