import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schemas';
import { prePOS } from '$lib/server/models';
import { now_datetime } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { and, eq, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const old_billing = await db.query.billing.findFirst({
		where: and(
			isNull(billing.visit_id),
			isNull(billing.progress_note_id),
			eq(billing.total, 0),
			eq(billing.status, 'paying'),
			eq(billing.checkin_type, 'POS')
		)
	});
	if (old_billing) {
		await db
			.update(billing)
			.set({
				created_at: now_datetime(),
				patient_id: null
			})
			.where(eq(billing.id, old_billing.id));

		return redirect(303, `/billing/pos/${old_billing.id}`);
	} else {
		const billing_id = await prePOS();
		if (billing_id) {
			return redirect(303, `/billing/pos/${billing_id}`);
		} else {
			return redirect(303, `/`);
		}
	}
};
