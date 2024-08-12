import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
export const load = (async () => {
	const get_clinichinfo = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});

	return { get_clinichinfo };
}) satisfies PageServerLoad;
