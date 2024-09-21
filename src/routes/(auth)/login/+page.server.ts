import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { lucia } from '$lib/server/auth/lucia';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) redirect(307, `/dashboard`);
	const get_clinichinfo = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	return { get_clinichinfo };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const body = await request.formData();
		const { username, password } = Object.fromEntries(body) as {
			username: string;
			password: string;
		};
		if (typeof username !== 'string' || username.length < 3 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		const existingUser = await db.query.user.findFirst({
			where: eq(user.username, username)
		});
		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}
		const validPassword = await verify(existingUser?.password_hash ?? '', password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}
		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		// redirect to
		// make sure you don't throw inside a try/catch block!
		redirect(303, `/dashboard`);
	}
};
