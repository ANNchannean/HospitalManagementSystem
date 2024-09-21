import { db } from '$lib/server/db';
import { subjective, visit } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const get_words = await db.query.words.findMany();
	const visit_id = params.id;
	if (isNaN(+visit_id)) redirect(303, '/patient/all');
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id)),
		with: {
			subjective: true
		}
	});
	return {
		get_visit,
		get_words
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_subjective: async ({ request, params }) => {
		const visit_id = params.id;
		if (isNaN(+visit_id)) redirect(303, '/patient/all');
		const body = await request.formData();
		const {
			cheif_complaint,
			history_of_present_illness,
			past_medical_history,
			allesgy_medicine,
			surgical_history,
			current_medication,
			family_and_social_history
		} = Object.fromEntries(body) as Record<string, string>;
		const get_subjective = await db.query.subjective.findFirst({
			where: eq(subjective.visit_id, Number(visit_id))
		});
		if (!get_subjective) {
			await db
				.insert(subjective)
				.values({
					allesgy_medicine: allesgy_medicine,
					cheif_complaint: cheif_complaint,
					past_medical_history: past_medical_history,
					history_of_present_illness: history_of_present_illness,
					surgical_history: surgical_history,
					visit_id: Number(visit_id),
					current_medication: current_medication,
					family_and_social_history: family_and_social_history
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (get_subjective) {
			await db
				.update(subjective)
				.set({
					allesgy_medicine: allesgy_medicine,
					cheif_complaint: cheif_complaint,
					past_medical_history: past_medical_history,
					history_of_present_illness: history_of_present_illness,
					surgical_history: surgical_history,

					current_medication: current_medication,
					family_and_social_history: family_and_social_history
				})
				.where(eq(subjective.visit_id, Number(visit_id)))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
