import { db } from '$lib/server/db';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { fileOrPicture, parameter, visit } from '$lib/server/schema';
import { generateQR } from '$lib/server/utils';
export const load: PageServerLoad = async ({ params, url }) => {
	const visit_id = params.id ?? '';
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, +visit_id || 0),
		with: {
			staff: true,
			laboratory: true,
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
	const removeDuplicateName = get_visit?.laboratoryRequest.filter(
		(value, index, selt) =>
			index ===
			selt.findIndex((t) => t.product?.laboratory_group_id === value.product?.laboratory_group_id)
	);
	const sort_laboraytor = get_visit?.laboratoryRequest.sort((a) => {
		if (a.product?.products.includes('CBC')) return -1;
		else return 1;
	});
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const get_imagers = await db.query.fileOrPicture.findMany({
		where: eq(fileOrPicture.laboratory_id, get_visit?.laboratory?.id || 0)
	});

	return {
		get_visit,
		removeDuplicateName,
		sort_laboraytor,
		get_clinic_info,
		get_imagers,
		url_qr: await generateQR(url.href)
	};
};
