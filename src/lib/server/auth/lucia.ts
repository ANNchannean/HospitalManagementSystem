import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/schema';
const adapter = new DrizzleMySQLAdapter(db, session, user);
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
			sameSite: 'strict'
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			role: attributes.role,
			image: attributes.image,
			limitview: attributes.limitview,
			lang: attributes.lang
		};
	}
});
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
interface DatabaseUserAttributes {
	username: string;
	role: 'ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'NURSE' | 'LABO_TECHICAL' | 'RADIOGRAPHY';
	image: string;
	limitview: number;
	lang: string;
}
