import { db } from '$lib/server/db';
import { words } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_words: async ({ request }) => {
		const body = await request.formData();
		const { word, type } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(words)
			.values({
				text: word,
				type: type
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
