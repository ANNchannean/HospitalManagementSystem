import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schema';

export const load: PageServerLoad = async ({ url }) => {
	const get_billings = await db.query.billing.findMany({
		where: eq(billing.checkin_type, 'OPD'),
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
