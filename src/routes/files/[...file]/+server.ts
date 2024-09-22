import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { fileOrPicture } from '$lib/server/schemas';
import fs from 'fs';
import path from 'path';
export const GET: RequestHandler = async ({ params }) => {
	const dirname = process.cwd();
	if (!params.file) {
		error(404, {
			message: 'File or Image not found'
		});
	}
	const get_file = await db.query.fileOrPicture
		.findFirst({
			where: eq(fileOrPicture.filename, params.file)
		})
		.catch((e) => console.log(e));
	if (!get_file?.filename) {
		error(404, {
			message: 'File or Image not found'
		});
	}
	try {
		const file = fs.readFileSync(path.join(dirname, 'files', get_file.filename));
		return new Response(file);
	} catch (e) {
		const no_image = fs.readFileSync(path.join(dirname, 'static', 'no-image.jpg'));
		console.log(e);
		return new Response(no_image);
	}

	// setHeaders({
	// 	'Content-Type': get_file?.mimeType ?? '',
	// 	'Content-Length': get_file?.size?.toString() ?? '',
	// 	'Last-Modified': get_file?.lastModified?.toString() ?? '',
	// 	'Cache-Control': 'public, max-age=600'
	// });
};
