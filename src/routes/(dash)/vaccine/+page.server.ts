import { db } from '$lib/server/db';
import { appointmentInjection } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	await parent();
	const get_injection = await db.query.injection.findMany({
		with: {
			product: true,
			patient: {
				with: {
					commune: true,
					district: true,
					provice: true,
					village: true
				}
			},
			vaccine: {
				with: {
					product: true,
					visit: true
				}
			},
			appointmentInjection: true
		}
	});

	return {
		get_injection
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_appointment_inject: async ({ request }) => {
		const body = await request.formData();
		const { times, appointment, discription, injection_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		await db.insert(appointmentInjection).values({
			appointment: appointment,
			times: times,
			discription: discription,
			injection_id: +injection_id,

		});
	}
};
