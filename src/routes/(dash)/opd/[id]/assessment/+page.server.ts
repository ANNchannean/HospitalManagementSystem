import { db } from '$lib/server/db';
import { accessment, remark } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	const get_diagnosis = await db.query.diagnosis_or_problem.findMany({});
	const get_diagnosisTypes = await db.query.diagnosisType.findMany({});
	const get_remark = await db.query.remark.findFirst({
		where: eq(remark.visit_id, +visit_id)
	});
	const get_accessment = await db.query.accessment.findFirst({
		where: eq(accessment.visit_id, +visit_id)
	});
	return {
		get_diagnosis,
		get_diagnosisTypes,
		get_accessment,
		get_remark
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_accessment: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const { diagnosis_differential, diagnosis_or_problem,description } = Object.fromEntries(body) as Record<
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
					diagnosis_or_problem: diagnosis_or_problem,
					differential_diagnosis: diagnosis_differential
				})
				.where(eq(accessment.id, check_accessment.id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (!check_accessment) {
			await db
				.insert(accessment)
				.values({
					diagnosis_or_problem: diagnosis_or_problem,
					differential_diagnosis: diagnosis_differential,
					visit_id: +visit_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		const get_remark = await db.query.remark.findFirst({
			where: eq(remark.visit_id, +visit_id)
		});
		if (!get_remark) {
			await db
				.insert(remark)
				.values({
					description: description,
					visit_id: +visit_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (get_remark) {
			await db
				.update(remark)
				.set({
					description: description
				})
				.where(eq(remark.visit_id, +visit_id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
