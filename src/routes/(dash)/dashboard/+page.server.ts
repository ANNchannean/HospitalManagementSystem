import { db } from '$lib/server/db';
import { uploadFile } from '$lib/server/fileHandle';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const picture = await db.query.fileOrPicture.findMany({});

	return { picture };
};
export const actions: Actions = {
	
	img: async ({ request }) => {
		const body = await request.formData();
		try {
			const file = body.get('file') as File;
			await uploadFile(file);
		} catch (error) {
			console.log(error);
		}
	}
};
