import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	await parent();
	const get_injection = await db.query.injection.findMany({
		with: {
			product: true,
			patient:{
				with:{
					commune:true,
					district:true,
					provice:true,
					village:true
				}
			},
			vaccine:{
				with:{
					product:true,
					visit:true
				}
			}
		}
	});
	
	return {
		get_injection,
	};
}) satisfies PageServerLoad;
