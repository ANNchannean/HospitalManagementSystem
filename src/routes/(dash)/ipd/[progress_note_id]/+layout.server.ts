import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { progressNote } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
export const load: LayoutServerLoad = async ({ params, parent }) => {
	await parent();
	const progress_note_id = params.progress_note_id;
	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, Number(progress_note_id)),
		with: {
			visit: {
				with: {
					department: true,

					physicalExam: true,
					subjective: true,
					vitalSign: true
				}
			},
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

	return {
		get_progress_note
	};
};
