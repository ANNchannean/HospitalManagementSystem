import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { fileOrPicture } from '$lib/server/schema';
import fs from 'fs';
import path from 'path';
export const GET: RequestHandler = async ({ params, setHeaders }) => {
	let dirname = process.cwd();
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
	let file = fs.readFileSync(path.join(dirname, 'files', get_file.filename));
	// setHeaders({
	// 	'Content-Type': get_file?.mimeType ?? '',
	// 	'Content-Length': get_file?.size?.toString() ?? '',
	// 	'Last-Modified': get_file?.lastModified?.toString() ?? '',
	// 	'Cache-Control': 'public, max-age=600'
	// });
	return new Response(file);
};
