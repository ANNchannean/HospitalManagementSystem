import { db } from '$lib/server/db';
import { setting } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_setting = await db.query.setting.findFirst({});
	return {
		get_setting
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_setting: async ({ request }) => {
		const body = await request.formData();
		const { currency_symbol, currency_from, rate_from, currency_to, rate_to, setting_id } =
			Object.fromEntries(body) as Record<string, string>;
		await db
			.update(setting)
			.set({
				currency_from: currency_from,
				currency_symbol: currency_symbol,
				currency_to: currency_to,
				rate_from: +rate_from,
				rate_to: +rate_to
			})
			.where(eq(setting.id, +setting_id));
	}
};
