import { db } from '$lib/server/db';
import { billing, visit } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	await parent();
	const get_departments = await db.query.department.findMany();
	const get_staffs = await db.query.staff.findMany();
	const get_visits = await db.query.visit.findMany({
		where: eq(visit.checkin_type, 'OPD'),
		with: {
			staff: true,
			patient: true,
			department: true,
			billing: true
		},
		orderBy: desc(visit.date_checkup)
	});
	return {
		get_visits,
		get_departments,
		get_staffs
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	send_to_ipd: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				checkin_type: 'IPD'
			})
			.where(eq(visit.id, +id));
	},
	update_etiology: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const etiology = body.get('etiology') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				etiology: etiology.toString()
			})
			.where(eq(visit.id, +id));
	},
	update_department: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const department_id = body.get('department_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				department_id: +department_id
			})
			.where(eq(visit.id, +id));
	},
	update_staff: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const staff_id = body.get('staff_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				staff_id: +staff_id
			})
			.where(eq(visit.id, +id));
	},
	process_billing: async ({ request }) => {
		const body = await request.formData();
		const billing_id = body.get('id');
		if (!billing_id || isNaN(+billing_id)) return fail(303, { idErr: true });
		await db
			.update(billing)
			.set({
				status: 'process',
				checkin_type: 'OPD'
			})
			.where(eq(billing.id, +billing_id));
	}
};
