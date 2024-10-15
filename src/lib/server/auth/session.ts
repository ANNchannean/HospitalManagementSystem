// src/lib/session.ts
const sessions = new Map(); // In-memory session store for simplicity

export async function createSession(username: string) {
	const sessionId = crypto.randomUUID(); // Generate a unique session ID
	sessions.set(sessionId, { username, createdAt: Date.now() });
	return sessionId;
}

export  function getSession(sessionId: string) {
	return sessions.get(sessionId);
}
