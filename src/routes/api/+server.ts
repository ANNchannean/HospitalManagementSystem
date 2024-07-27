import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { product } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const laboratory = await db.query.product.findMany({
		where: eq(product.id, 504),
		with: {
			parameter: true
		}
	});
	return json(laboratory);
};
