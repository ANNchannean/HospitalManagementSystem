import { db } from '$lib/server/db';
import { subjective, visit } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	if (isNaN(+visit_id)) redirect(303, '/patient/all');
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id)),
		with: {
			subjective: true
		}
	});
	return {
		get_visit
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_subjective: async ({ request, params }) => {
		const visit_id = params.id;
		if (isNaN(+visit_id)) redirect(303, '/patient/all');
		const body = await request.formData();
		const {
			cheif_complaint,
			past_history,
			present_illness,
			past_medicine_history,
			allesgy_medicine,
			surgical_history,
			familly_history
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
					familly_history: familly_history,
					past_history: past_history,
					past_medicine_history: past_medicine_history,
					present_illness: present_illness,
					surgical_history: surgical_history,
					visit_id: Number(visit_id)
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
		if (get_subjective) {
			await db
				.update(subjective)
				.set({
					allesgy_medicine: allesgy_medicine,
					cheif_complaint: cheif_complaint,
					familly_history: familly_history,
					past_history: past_history,
					past_medicine_history: past_medicine_history,
					present_illness: present_illness,
					surgical_history: surgical_history
				})
				.where(eq(subjective.visit_id, Number(visit_id)))
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
		redirect(303, '?');
	}
};
