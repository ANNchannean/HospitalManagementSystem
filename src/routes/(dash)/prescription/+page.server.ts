import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const get_prescriptions = await db.query.presrciption.findMany({
		with: {
			product: true,
			visit: true
		}
	});
	return {
		get_prescriptions
	};
}) satisfies PageServerLoad;
