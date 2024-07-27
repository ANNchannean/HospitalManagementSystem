import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async ({ params }) => {
	let dirname = process.cwd();
	if (!params.name_backup) {
		error(404, {
			message: 'File not found'
		});
	}
	let file = fs.readFileSync(path.join(dirname, 'sql-backup', params.name_backup));

	return new Response(file);
};
