import { db } from '$lib/server/db';
import { appointmentInjection, injection, vaccine } from '$lib/server/schema';
import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ parent }) => {
	await parent();
	const get_injection = await db.query.injection.findMany({
		with: {
			unit: true,
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
				},
				orderBy: asc(vaccine.id)
			},
			appointmentInjection: {
				orderBy: asc(appointmentInjection.times)
			}
		},
		orderBy: desc(injection.datetime)
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
		await db
			.insert(appointmentInjection)
			.values({
				appointment: appointment,
				times: +times,
				discription: discription,
				injection_id: +injection_id
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_appointment_inject: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		const get_appoinmten = await db.query.appointmentInjection.findFirst({
			where: eq(appointmentInjection.id, +id)
		});
		await db
			.update(appointmentInjection)
			.set({
				status: !get_appoinmten?.status,
				datetime_inject: now_datetime()
			})
			.where(eq(appointmentInjection.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_appionment_inject: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(appointmentInjection)
			.where(eq(appointmentInjection.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
