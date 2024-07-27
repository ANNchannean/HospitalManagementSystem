import { db } from '$lib/server/db';
import { physicalExam, visit, vitalSign } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	const visit_id = params.id;
	const get_physical_exam = await db.query.physicalExam.findMany({
		where: eq(physicalExam.visit_id, +visit_id)
	});
	const get_exams = await db.query.exam.findMany({
		with: {
			physical: true
		}
	});
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, Number(visit_id)),
		with: {
			vitalSign: true,
			physicalExam: true
		}
	});
	return {
		get_visit,
		get_exams,
		get_physical_exam
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_vital_sign: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const { pulse, t, sp02, height, weight, bmi, sbp, dbp, rr } = Object.fromEntries(
			body
		) as Record<string, string>;
		const get_vital_sign = await db.query.vitalSign.findFirst({
			where: eq(vitalSign.visit_id, Number(visit_id))
		});
		if (!get_vital_sign) {
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
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
		if (get_vital_sign) {
			await db
				.update(vitalSign)
				.set({
					bmi: +bmi,
					rr: +rr,
					height: +height,
					weight: +weight,
					pulse: +pulse,
					sp02: +sp02,
					t: +t,
					sbp: +sbp,
					dbp: +dbp
				})
				.where(eq(vitalSign.visit_id, Number(visit_id)))
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: true });
				});
		}
	},
	exam_result: async ({ request, params }) => {
		const visit_id = params.id;
		const body = await request.formData();
		const physical_exam_id = body.getAll('physical_exam_id');
		const physical = body.getAll('physical');
		const physical_id = body.getAll('physical_id');
		if (physical_exam_id.length) {
			for (const e of physical_exam_id) {
				await db.delete(physicalExam).where(eq(physicalExam.id, +e));
			}
		}
		if (physical_id.length) {
			for (let index = 0; index < physical_id.length; index++) {
				const element = physical_id[index];
				await db.insert(physicalExam).values({
					physical_id: +element,
					visit_id: +visit_id,
					result: physical[index].toString()
				});
			}
		}
	}
};
