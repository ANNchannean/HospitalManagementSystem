import { createSession } from '$lib/server/auth/session';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();
	// Authenticate the user (replace with real authentication logic)
	if (username === 'user' && password === 'pass') {
		const sessionId = await createSession(username); // create a session in DB or memory
		cookies.set('session_id', sessionId, { path: '/', httpOnly: true });
		return json({ message: 'Login successful' });
	} else {
		return json({ message: 'Invalid credentials' }, { status: 401 });
	}
};
