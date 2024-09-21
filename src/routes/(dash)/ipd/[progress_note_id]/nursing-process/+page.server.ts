import { db } from '$lib/server/db';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { nursingProcess } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load: PageServerLoad = async ({ params }) => {
	const progress_note_id = params.progress_note_id;
	const get_nursing_process = await db.query.nursingProcess.findMany({
		where: eq(nursingProcess.progress_note_id, +progress_note_id),
		orderBy: desc(nursingProcess.datetime)
	});

	return {
		get_nursing_process
	};
};

export const actions: Actions = {
	create_nursing_process: async ({ request, params }) => {
		const body = await request.formData();
		const progress_note_id = params.progress_note_id;
		const { nursing_process_id, accessment, health_problems, actions, evolution, time, date } =
			Object.fromEntries(body) as Record<string, string>;

		if (!nursing_process_id) {
			await db
				.insert(nursingProcess)
				.values({
					datetime: now_datetime(),
					accessment: accessment,
					health_problems: health_problems,
					actions: actions,
					evolution: evolution,
					progress_note_id: +progress_note_id
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (nursing_process_id) {
			await db
				.update(nursingProcess)
				.set({
					accessment: accessment,
					health_problems: health_problems,
					actions: actions,
					evolution: evolution,
					datetime: date.toString().slice(0, 11).concat(' ').concat(time.toString())
				})
				.where(eq(nursingProcess.id, +nursing_process_id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	},
	delete_nursing_process: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(nursingProcess)
			.where(eq(nursingProcess.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
