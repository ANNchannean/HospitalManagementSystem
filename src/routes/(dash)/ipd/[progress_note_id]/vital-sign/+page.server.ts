import { db } from '$lib/server/db';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { vitalSign } from '$lib/server/schema';
import { now_datetime } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const progress_note_id = params.progress_note_id;
	const get_vital_sing_ipd = await db.query.vitalSign.findMany({
		where: eq(vitalSign.progress_note_id, +progress_note_id),
		orderBy: desc(vitalSign.datetime)
	});

	return {
		get_vital_sing_ipd
	};
};

export const actions: Actions = {
	create_vital_sign_ipd: async ({ request, params }) => {
		const body = await request.formData();
		const progress_note_id = params.progress_note_id;
		const {
			sbp,
			dbp,
			pulse,
			t,
			rr,
			sp02,
			weight,
			piv,
			drink,
			nasogastric_tube_in,
			nasogastric_tube_out,
			fluid_out,
			vomiting,
			stool,
			urine,
			note,
			time,
			date,
			vital_sign_id
		} = Object.fromEntries(body);
		if (vital_sign_id) {
			await db
				.update(vitalSign)
				.set({
					datetime: date.toString().slice(0, 11).concat(' ').concat(time.toString()),
					progress_note_id: +progress_note_id,
					sbp: +sbp,
					dbp: +dbp,
					pulse: +pulse,
					t: +t,
					rr: +rr,
					sp02: +sp02,
					weight: +weight,
					piv: +piv,
					drink: +drink,
					nasogastric_tube_in: +nasogastric_tube_in,
					nasogastric_tube_out: +nasogastric_tube_out,
					fluid_out: +fluid_out,
					vomiting: +vomiting,
					stool: stool.toString() ?? '',
					urine: urine.toString() ?? '',
					note: note.toString() ?? ''
				})
				.where(eq(vitalSign.id, +vital_sign_id))
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: e });
				});
		}
		if (!vital_sign_id) {
			await db
				.insert(vitalSign)
				.values({
					datetime: now_datetime(),
					progress_note_id: +progress_note_id,
					sbp: +sbp,
					dbp: +dbp,
					pulse: +pulse,
					t: +t,
					rr: +rr,
					sp02: +sp02,
					weight: +weight,
					piv: +piv,
					drink: +drink,
					nasogastric_tube_in: +nasogastric_tube_in,
					nasogastric_tube_out: +nasogastric_tube_out,
					fluid_out: +fluid_out,
					vomiting: +vomiting,
					stool: stool.toString() ?? '',
					urine: urine.toString() ?? '',
					note: note.toString() ?? ''
				})
				.catch((e) => {
					console.log(e);
					return fail(500, { serverError: e });
				});
		}
	},
	delete_vital_sign: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(vitalSign)
			.where(eq(vitalSign.id, +id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: e });
			});
	}
};
