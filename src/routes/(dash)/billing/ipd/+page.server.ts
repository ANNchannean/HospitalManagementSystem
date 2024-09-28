import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schemas';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const get_billings = await db.query.billing.findMany({
		where: and(eq(billing.status, 'process'), eq(billing.checkin_type, 'IPD')),
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
			patient: true
		}
	});

	return {
		get_billings
	};
};
