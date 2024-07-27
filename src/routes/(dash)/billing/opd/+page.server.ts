import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing } from '$lib/server/schema';

export const load: PageServerLoad = async ({ url }) => {
	const get_billings = await db.query.billing.findMany({
		where: eq(billing.status, 'process'),
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
