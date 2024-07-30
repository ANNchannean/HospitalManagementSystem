import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
export const load = (async ({parent}) => {
	await parent()
	const get_staffs = await db.query.staff.findMany({});
	const get_users = await db.query.user.findMany({});
	return {
		get_users,
		get_staffs
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_user: async ({ request }) => {
		const body = await request.formData();
		const { staff_id, username, password, role } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			staff_id: false,
			username: false,
			password: false,
			role: false
		};
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			validErr.username = true;
		}
		if (typeof password !== 'string' || password.length < 4 || password.length > 255) {
			validErr.password = true;
		}
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const userId = generateIdFromEntropySize(10);
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		await db.insert(user).values({
			id: userId,
			image: '',
			staff_id: staff_id ? +staff_id : undefined,
			role: role as 'DOCTOR' | 'PHARMACIST' | 'NURSE' | 'LABO_TECHICAL' | 'ADMIN' | 'RADIOGRAPHY',
			password_hash: passwordHash,
			username: username
		});
	},
	update_user: async ({ request }) => {
		const body = await request.formData();
		const { staff_id, username, role, user_id } = Object.fromEntries(body) as Record<
			string,
			string
		>;
		const validErr = {
			staff_id: false,
			username: false,
			user_id: false,
			role: false
		};
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			validErr.username = true;
		}
		if (!user_id) validErr.user_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(user)
			.set({
				image: '',
				staff_id: staff_id ? +staff_id : undefined,
				role: role as 'DOCTOR' | 'PHARMACIST' | 'NURSE' | 'LABO_TECHICAL' | 'ADMIN' | 'RADIOGRAPHY',
				username: username
			})
			.where(eq(user.id, user_id));
	}
};
