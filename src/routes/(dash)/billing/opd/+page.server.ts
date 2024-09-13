import { db } from '$lib/server/db';
import { and, eq, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schema';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const get_billings = await db.query.billing.findMany({
		where: and(eq(billing.status, 'process'), isNull(billing.pos_id)),
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
		}
	});

	return {
		get_billings
	};
};
