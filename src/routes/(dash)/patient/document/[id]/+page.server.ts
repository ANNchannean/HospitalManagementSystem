import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { document, visit } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ params }) => {
	const { id } = params;
	const get_document = await db.query.document.findFirst({
		where: eq(document.id, +id)
	});
	if (!get_document?.visit_id) redirect(300, '/patient');
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, get_document!.visit_id),
		with: {
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			}
		}
	});
	const get_clinicinfo = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	return {
		get_document,
		get_visit,
		get_clinicinfo
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_document: async ({ request }) => {
		const body = await request.formData();
		const { document_content, id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(document)
			.set({
				content: document_content
			})
			.where(eq(document.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
