import { db } from '$lib/server/db';
import { formDocument } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;

	const get_form_document = await db.query.formDocument.findFirst({
		where: eq(formDocument.id, +id || 0)
	});
	return {
		get_form_document
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_document: async ({ request }) => {
		const body = await request.formData();
		console.log(body);
		const { title, content } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(formDocument).values({
			content: content,
			title: title,
			datetime: now_datetime()
		});
	}
};
