import { db } from '$lib/server/db';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schemas';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const get_billings = await db.query.billing.findMany({
		where: and(eq(billing.status, 'paying'), eq(billing.billing_type, 'IPD')),
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
			},
			patient: true,
			progressNote: true
		},

		orderBy: desc(billing.created_at)
	});

	return {
		get_billings
	};
};
