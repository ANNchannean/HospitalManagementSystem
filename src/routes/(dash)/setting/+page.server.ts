import { db } from '$lib/server/db';
import { currency } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { logErrorMessage } from '$lib/server/telegram';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const get_currency = await db.query.currency.findFirst({});
	return {
		get_currency
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_currency: async ({ request }) => {
		const body = await request.formData();
		const { symbol, rate_to, rate_from, dialy_rate, currency_id, from_symbol } = Object.fromEntries(
			body
		) as Record<string, string>;
		const validErr = {
			symbol: false,
			rate_to: false,
			rate_from: false,
			dialy_rate: false,
			currency_id: false,
			from_symbol: false
		};
		if (!symbol || symbol.length > 1) validErr.symbol = true;
		if (!rate_to) validErr.rate_to = true;
		if (!rate_from) validErr.rate_from = true;
		if (!dialy_rate) validErr.dialy_rate = true;
		if (!from_symbol || from_symbol.length > 1) validErr.from_symbol = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		if (currency_id) {
			await db
				.update(currency)
				.set({
					symbol: symbol,
					rate_to: +rate_to,
					rate_from: +rate_from,
					dialy_rate: +dialy_rate,
					from_symbol: from_symbol
				})
				.where(eq(currency.id, 1))
				.catch((e) => {
					logErrorMessage(e);
				});
		} else {
			await db
				.insert(currency)
				.values({
					symbol: symbol,
					rate_to: +rate_to,
					rate_from: +rate_from,
					dialy_rate: +dialy_rate,
					from_symbol: from_symbol
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
