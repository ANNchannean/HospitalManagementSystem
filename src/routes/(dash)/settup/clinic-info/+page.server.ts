import { db } from '$lib/server/db';
import { updateFile } from '$lib/server/fileHandle';
import { clinicinfo, fileOrPicture } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram';
export const load: PageServerLoad = async () => {
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
		const { title_khm, title_eng, address, contact, id, detail, logo0, logo1 } = Object.fromEntries(
			body
		) as Record<string, string>;
		const img0 = body.get('img0') as File;
		const img1 = body.get('img1') as File;
		const fineclinichinfo = await db.query.clinicinfo.findFirst();
		if (id) {
			await db
				.update(clinicinfo)
				.set({
					address: address,
					detail: detail,
					contact: contact,
					title_eng: title_eng,
					title_khm: title_khm
				})
				.where(eq(clinicinfo.id, fineclinichinfo!.id))
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		if (!id) {
			await db
				.insert(clinicinfo)
				.values({
					address: address,
					detail: detail,
					contact: contact,
					title_eng: title_eng,
					title_khm: title_khm
				})
				.catch((e) => {
					logErrorMessage(e);
				});
		}
		const get_clinic_info = await db.query.clinicinfo.findFirst();
		if (img0.size) {
			if (logo0) {
				await db
					.update(fileOrPicture)
					.set({
						filename: await updateFile(img0, logo0)
					})
					.where(eq(fileOrPicture.filename, logo0))
					.catch((e) => {
						logErrorMessage(e);
					});
			}
			if (!logo0) {
				await db
					.insert(fileOrPicture)
					.values({
						filename: await updateFile(img0, logo0),
						clinicinfo_id: get_clinic_info?.id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
		if (img1.size) {
			if (logo1) {
				await db
					.update(fileOrPicture)
					.set({
						filename: await updateFile(img1, logo1)
					})
					.where(eq(fileOrPicture.filename, logo1))
					.catch((e) => {
						logErrorMessage(e);
					});
			}
			if (!logo1) {
				await db
					.insert(fileOrPicture)
					.values({
						filename: await updateFile(img1, logo1),
						clinicinfo_id: get_clinic_info?.id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}

		redirect(303, '?');
	}
};
