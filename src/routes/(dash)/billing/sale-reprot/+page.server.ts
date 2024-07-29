import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schema';

export const load: PageServerLoad = async () => {
	const get_billings = await db.query.billing.findMany({
		where: and(
			eq(billing.checkin_type, 'OPD'),
			or(eq(billing.status, 'paid'), eq(billing.status, 'due'), eq(billing.status, 'partial'))
		),
		with: {
			visit: {
				with: {
					patient: {
						with: {
							commune: true,
							district: true,
							provice: true,
							village: true
						}
					},
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
