import { db } from '$lib/server/db';
import { updateFile, uploadFile } from '$lib/server/fileHandle';
import { clinicinfo, fileOrPicture } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
export const load: PageServerLoad = async ({}) => {
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	return {
		get_clinic_info: get_clinic_info
	};
};

export const actions: Actions = {
	create_clinic_info: async ({ request }) => {
		const body = await request.formData();
		const { title_khm, title_eng, address, contact, id, detail, logo } = Object.fromEntries(
			body
		) as Record<string, string>;
		const file = body.get('file') as File;
		if (id) {
			await db.update(clinicinfo).set({
				address: address,
				detail: detail,
				contact: contact,
				title_eng: title_eng,
				title_khm: title_khm
			});
		}
		if (!id) {
			await db.insert(clinicinfo).values({
				address: address,
				detail: detail,
				contact: contact,
				title_eng: title_eng,
				title_khm: title_khm
			});
		}
		const get_clinic_info = await db.query.clinicinfo.findFirst();
		if (file.size) {
			if (logo) {
				await db
					.update(fileOrPicture)
					.set({
						filename: await updateFile(file, logo)
					})
					.where(eq(fileOrPicture.filename, logo));
			}
			if (!logo) {
				await db.insert(fileOrPicture).values({
					filename: await updateFile(file, logo),
					clinicinfo_id: get_clinic_info?.id
				});
			}
		}

		redirect(303, '?');
	}
};
