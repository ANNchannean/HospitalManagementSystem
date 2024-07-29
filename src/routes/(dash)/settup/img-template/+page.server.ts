import { db } from '$lib/server/db';
import { template } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';

export const load = (async () => {
	const get_templates = await db.query.template.findMany({
		orderBy: asc(template.diagnosis)
	});

	return {
		get_templates
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_template: async ({ request }) => {
		const body = await request.formData();
		const { diagnosis, template_ } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			diagnosis: false,
			template_: false
		};
		if (!diagnosis.trim()) validErr.diagnosis = true;
		if (!template_) validErr.template_ = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.insert(template)
			.values({
				diagnosis: diagnosis,
				template: template_
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_template: async ({ request }) => {
		const body = await request.formData();
		const { diagnosis, template_, template_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			diagnosis: false,
			template_: false
		};
		if (!diagnosis.trim()) validErr.diagnosis = true;
		if (!template_) validErr.template_ = true;
		if (isNaN(+template_id)) validErr.template_ = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(template)
			.set({
				diagnosis: diagnosis,
				template: template_
			})
			.where(eq(template.id, +template_id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	delete_template: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(template)
			.where(eq(template.id, +id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
