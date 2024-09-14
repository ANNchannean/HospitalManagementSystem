import { db } from '$lib/server/db';
import { billing } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const get_currency = await db.query.currency.findFirst({});
	const get_billing = await db.query.billing.findFirst({
		where: eq(billing.id, +id),
		with: {
			pos: {
				with: {
					patient: {
						with: {
							commune: true,
							district: true,
							provice: true,
							village: true
						}
					}
				}
			},
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
			},
			payment: {
				with: {
					paymentType: true,
					fileOrPicture: true
				}
			}
		}
	});

	return {
		get_billing,
		get_currency,
		get_clinic_info
	};
}) satisfies PageServerLoad;
