import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// eslint-disable-next-line drizzle/enforce-delete-with-where
	cookies.delete('session_id', { path: '/' }); // Remove session cookie
	return json({ message: 'Logged out' });
};
