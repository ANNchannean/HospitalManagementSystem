import { db } from '$lib/server/db';
import { exam, physical } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const get_physical = await db.query.physical.findMany();
	const get_exams = await db.query.exam.findMany({
		orderBy: asc(exam.id),
		with: {
			physical: true
		}
	});
	return {
		get_examas: get_exams,
		get_physical
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_exam: async ({ request }) => {
		const body = await request.formData();
		const { examination } = Object.fromEntries(body) as Record<string, string>;
		if (!examination.trim()) return fail(400, { examination: true });
		await db
			.insert(exam)
			.values({
				examination: examination
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_exam: async ({ request }) => {
		const body = await request.formData();
		const { examination, examination_id } = Object.fromEntries(body) as Record<string, string>;
		if (!examination.trim() || isNaN(+examination_id)) return fail(400, { examination: true });
		await db
			.update(exam)
			.set({
				examination: examination
			})
			.where(eq(exam.id, Number(examination_id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_exam: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(exam)
			.where(eq(exam.id, Number(id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	create_physical: async ({ request }) => {
		const body = await request.formData();
		const { physical_name, exam_id } = Object.fromEntries(body) as Record<string, string>;
		if (!physical_name.trim()) return fail(400, { physical_name: true });
		await db
			.insert(physical)
			.values({
				physical: physical_name,
				exam_id: +exam_id
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_physical: async ({ request }) => {
		const body = await request.formData();
		const physical_name = body.getAll('physical_name');
		const id = body.getAll('id');
		for (let index = 0; index < id.length; index++) {
			const element = id[index];
			await db
				.update(physical)
				.set({
					physical: physical_name[index].toString()
				})
				.where(eq(physical.id, +element));
		}
	},
	delete_physical: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id') ?? '';
		await db.delete(physical).where(eq(physical.id, +id));
	}
};
