import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { uploadFile } from '$lib/server/fileHandle';
import { fileOrPicture } from '$lib/server/schema';
import { error, fail } from '@sveltejs/kit';
import child from 'child_process';
import util from 'util';
const exec = util.promisify(child.exec);

export const load: PageServerLoad = async () => {
	const picture = await db.query.fileOrPicture.findMany({});

	return { picture };
};
export const actions: Actions = {
	img: async ({ request }) => {
		// const body = await request.formData();
		// try {
		// 	const file = body.get('file') as File;
		// 	uploadFile(file);
		// } catch (error) {
		// 	console.log(error);
		// }
		try {
			await exec(`ls`);
		} catch (error) {
			console.log(error);
		}
	}
};
