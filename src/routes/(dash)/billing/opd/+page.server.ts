import { db } from '$lib/server/db';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing, visit } from '$lib/server/schemas';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const get_billings = await db.query.billing.findMany({
		where: and(
			eq(billing.status, 'paying'),
			isNotNull(billing.visit_id),
			isNull(visit.progress_note_id),
			eq(billing.billing_type, 'OPD')
		),
		with: {
			visit: {
				with: {
					patient: true,
					staff: true,
					department: true
				}
			},
			charge: {
				with: {
					productOrder: {
						with: {
							product: true
						}
					}
				}
			}
		},
		orderBy: desc(billing.created_at)
	});
	return {
		get_billings
	};
};
