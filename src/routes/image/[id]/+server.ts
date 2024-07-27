import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { fileOrPicture } from '$lib/server/schema';

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	if (!params.id) {
		error(404, {
			message: 'File or Image not found'
		});
	}

	const id = parseInt(params.id);

	if (!id) {
		error(404, {
			message: 'File or Image not found'
		});
	}
	const img = await db.query.fileOrPicture.findFirst({
		where: eq(fileOrPicture.id, +id || 0)
	});

	// TODO: greate getAlbumImage function

	if (!img || !img.filename) {
		error(404, 'File or Image not found');
	}
	const file = Buffer.from(img.filename, 'base64');
	// set response headers for image
	setHeaders({
		'Content-Type': img.mimeType ?? '',
		'Content-Length': img.size?.toString() ?? '',
		'Last-Modified': img.lastModified?.toString() ?? '',
		'Cache-Control': 'public, max-age=600'
	});
	return new Response(file);
};
