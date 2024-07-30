import { db } from '$lib/server/db';
import { staff } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	await parent();
	const get_staffs = await db.query.staff.findMany({});
	return {
		get_staffs
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_staff: async ({ request }) => {
		const body = await request.formData();
		const { name, gender, specific, staff_type } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			name: false,
			staff_id: false,
			gender: false,
			specific: false,
			staff_type: false
		};
		if (name.trim().length < 2) validErr.name = true;
		if (!gender.trim().length) validErr.gender = true;
		if (specific.trim().length < 2) validErr.specific = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		try {
			await db.insert(staff).values({
				name: name,
				gender: gender,
				specific: specific,
				staff_type: staff_type as
					| 'DOCTOR'
					| 'PHARMACIST'
					| 'NURSE'
					| 'LABO_TECHICAL'
					| 'ADMIN'
					| 'RADIOGRAPHY'
			});
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: true });
		}
	},
	update_staff: async ({ request }) => {
		const body = await request.formData();
		const { name, gender, specific, staff_id, staff_type } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			name: false,
			staff_id: false,
			gender: false,
			specific: false
		};
		if (name.trim().length < 2) validErr.name = true;
		if (!gender.trim().length) validErr.gender = true;
		if (specific.trim().length < 2) validErr.specific = true;
		if (isNaN(+staff_id)) validErr.staff_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		try {
			await db
				.update(staff)
				.set({
					name: name,
					gender: gender,
					specific: specific,
					staff_type: staff_type as
						| 'DOCTOR'
						| 'PHARMACIST'
						| 'NURSE'
						| 'LABO_TECHICAL'
						| 'ADMIN'
						| 'RADIOGRAPHY'
				})
				.where(eq(staff.id, Number(staff_id)));
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: true });
		}
	},
	delete_staff: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		try {
			await db.delete(staff).where(eq(staff.id, Number(id)));
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: true });
		}
	}
};
