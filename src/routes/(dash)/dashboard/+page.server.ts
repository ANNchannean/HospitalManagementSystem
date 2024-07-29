import { db } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import child from 'child_process';
import util from 'util';
const exec = util.promisify(child.exec);

export const load: PageServerLoad = async () => {
	const picture = await db.query.fileOrPicture.findMany({});

	return { picture };
};
export const actions: Actions = {
	img: async () => {
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
