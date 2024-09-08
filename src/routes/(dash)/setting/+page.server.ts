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
		const {
			currency_symbol,
			currency: _currency,
			currency_rate,
			exchang_to,
			exchang_rate,
			currency_id
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			currency_symbol: false,
			_currency: false,
			currency_rate: false,
			exchang_to: false,
			exchang_rate: false
		};
		if (!currency_symbol || currency_symbol.length > 5) validErr.currency_symbol = true;
		if (!_currency || _currency.length > 5) validErr._currency = true;
		if (!currency_rate) validErr.currency_rate = true;
		if (!exchang_to || exchang_to.length > 5) validErr.exchang_to = true;
		if (!exchang_rate) validErr.exchang_rate = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		if (currency_id) {
			await db
				.update(currency)
				.set({
					currency_symbol: currency_symbol,
					currency: _currency,
					currency_rate: +currency_rate,
					exchang_to: exchang_to,
					exchang_rate: +exchang_rate
				})
				.where(eq(currency.id, 1))
				.catch((e) => {
					logErrorMessage(e);
				});
		} else {
			await db
				.insert(currency)
				.values({
					currency_symbol: currency_symbol,
					currency: _currency,
					currency_rate: +currency_rate,
					exchang_to: exchang_to,
					exchang_rate: +exchang_rate
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
	}
};
