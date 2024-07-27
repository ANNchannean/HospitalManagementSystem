import { db } from '$lib/server/db';
import { department } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const get_departments = await db.query.department.findMany({});
	return {
		get_departments
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_department: async ({ request }) => {
		const body = await request.formData();
		const { department_ } = Object.fromEntries(body) as Record<string, string>;
		if (!department_.trim()) return fail(400, { department_: true });
		await db
			.insert(department)
			.values({
				department: department_
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_department: async ({ request }) => {
		const body = await request.formData();
		const { department_, department_id } = Object.fromEntries(body) as Record<string, string>;
		if (!department_.trim()) return fail(400, { department_: true });
		await db
			.update(department)
			.set({
				department: department_
			})
			.where(eq(department.id, Number(department_id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_department: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(department)
			.where(eq(department.id, Number(id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
