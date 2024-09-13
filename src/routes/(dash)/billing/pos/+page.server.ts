import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { billing, pos } from '$lib/server/schema';
import { prePOS } from '$lib/server/models';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { redirect } from '@sveltejs/kit';
import { and, eq, isNotNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const old_billing = await db.query.billing.findFirst({
		where: and(isNotNull(billing.pos_id), eq(billing.total, 0), eq(billing.status, 'process'))
	});
	if (old_billing) {
		await db
			.update(billing)
			.set({
				created_at: now_datetime()
			})
			.where(eq(billing.id, old_billing.id));

		return redirect(303, `/billing/pos/${old_billing.id}`);
	} else {
		const pos_id: { id: number }[] = await db
			.insert(pos)
			.values({
				datetime: now_datetime()
			})
			.$returningId()
			.catch((e) => {
				logErrorMessage(e);
				return [];
			});
		const billing_id = await prePOS(pos_id[0].id);
		if (billing_id) {
			return redirect(303, `/billing/pos/${billing_id}`);
		} else {
			return redirect(303, `/`);
		}
	}
};
