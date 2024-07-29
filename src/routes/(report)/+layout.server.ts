import { db } from '$lib/server/db';
import { parameter, visit } from '$lib/server/schema';
import { asc, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const visit_id = params.id || 0;
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, +visit_id || 0),
		with: {
			staff: true,
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			},
			laboratoryRequest: {
				with: {
					product: {
						with: {
							parameter: {
								with: {
									unit: true,
									laboratoryResult: true
								},
								orderBy: asc(parameter.id)
							},
							laboratoryGroup: true
						}
					},
					laboratoryResult: {
						with: {
							parameter: {
								with: {
									unit: true
								}
							}
						}
					}
				}
			}
		}
	});

	return {
		get_clinic_info: get_clinic_info,
		get_visit: get_visit
	};
};
