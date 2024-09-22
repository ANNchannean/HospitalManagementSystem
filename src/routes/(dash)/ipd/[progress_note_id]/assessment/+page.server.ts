import { db } from '$lib/server/db';
import { accessment } from '$lib/server/schemas';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const { progress_note_id } = params;
	const get_diagnosis = await db.query.diagnosis.findMany({});
	const get_diagnosisTypes = await db.query.diagnosisType.findMany({});
	const get_accessment = await db.query.accessment.findFirst({
		where: eq(accessment.progress_note_id, +progress_note_id)
	});
	return {
		get_diagnosis,
		get_diagnosisTypes,
		get_accessment
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_accessment: async ({ request, params }) => {
		const { progress_note_id } = params;
		const body = await request.formData();
		const { diagnosis_differential, diagnosis_or_problem } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const check_accessment = await db.query.accessment.findFirst({
			where: eq(accessment.progress_note_id, +progress_note_id)
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
					progress_note_id: +progress_note_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
