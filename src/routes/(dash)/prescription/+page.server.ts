import { db } from '$lib/server/db';
import { adviceTeaching, presrciption, product, unit, use, visit } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ url, params }) => {
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
