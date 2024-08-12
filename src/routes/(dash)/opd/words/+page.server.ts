import { db } from '$lib/server/db';
import { words } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
import { eq } from 'drizzle-orm';
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
	},
	update_words: async ({ request }) => {
		const body = await request.formData();
		const { word, type, id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(words)
			.set({
				text: word,
				type: type
			})
			.where(eq(words.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_words: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(words)
			.where(eq(words.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
