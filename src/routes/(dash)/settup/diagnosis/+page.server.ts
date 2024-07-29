import { db } from '$lib/server/db';
import { diagnosis } from '$lib/server/schema';
import type { PageServerLoad } from './$types';
import { and, eq, like, or } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const diagnosis_type_id = url.searchParams.get('diagnosis_type_id') || '';
	const q = url.searchParams.get('q') || '';
	const get_diagnosis_group = await db.query.diagnosisType.findMany({});
	const get_diagonosis = await db.query.diagnosis.findMany({
		with: {
			diagnosisType: true
		},
		where: and(
			diagnosis_type_id
				? eq(diagnosis.diagnosis_type_id, +diagnosis_type_id)
				: eq(diagnosis.diagnosis_type_id, 1),
			or(like(diagnosis.diagnosis, `%${q}%`))
		)
	});

	return {
		get_diagonosis,
		get_diagnosis_group
	};
}) satisfies PageServerLoad;
