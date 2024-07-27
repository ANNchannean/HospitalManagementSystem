import { db } from '$lib/server/db';
import { fileOrPicture, patient } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, desc, eq } from 'drizzle-orm';
import { deleteFile, updateFile, uploadFile } from '$lib/server/fileHandle';
import { now_datetime } from '$lib/server/utils';

export const load = (async () => {
	const provinces = await db.query.provice.findMany({});
	const districts = await db.query.district.findMany({});
	const communes = await db.query.commune.findMany({});
	const vilates = await db.query.village.findMany({});

	const patients = await db.query.patient.findMany({
		orderBy: desc(patient.id),
		with: {
			provice: true,
			district: true,
			commune: true,
			village: true,
			fileOrPicture: true
		}
	});

	return {
		get_patients: patients,
		get_province: provinces,
		get_district: districts,
		get_commune: communes,
		get_village: vilates
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_patient: async ({ request }) => {
		const body = await request.formData();
		const image = body.get('image') as File;
		const {
			name_khmer,
			name_latin,
			province_id,
			district_id,
			age,
			dob,
			commune_id,
			village_id,
			other,
			telephone,
			gender
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			name_khmer: false,
			name_latin: false,
			province_id: false,
			district_id: false,
			age: false,
			dob: false,
			commune_id: false,
			village_id: false,
			other: false,
			telephone: false,
			gender: false
		};
		if (!name_khmer.trim()) validErr.name_khmer = true;
		if (!name_latin.trim()) validErr.name_latin = true;
		if (isNaN(+age) || !age.trim()) validErr.age = true;
		if (!dob.trim()) validErr.dob = true;
		if (!gender.trim()) validErr.gender = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const created_at = now_datetime();
		try {
			await db.insert(patient).values({
				age: Number(age),
				dob: dob,
				gender: gender,
				name_khmer: name_khmer,
				name_latin: name_latin,
				telephone: telephone,
				province_id: Number(province_id) || null,
				district_id: Number(district_id) || null,
				commune_id: Number(commune_id) || null,
				village_id: Number(village_id) || null,
				other: other,
				created_at: created_at
			});
			if (image.size) {
				const patient_id = await db.query.patient.findFirst({
					where: eq(patient.created_at, created_at)
				});
				const filename = await uploadFile(image);
				await db.insert(fileOrPicture).values({
					filename: filename,
					mimeType: image.type,
					size: image.size,
					lastModified: image.lastModified,
					patient_id: patient_id?.id
				});
			}
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: true });
		}
	},
	update_patient: async ({ request }) => {
		const body = await request.formData();
		const image = body.get('image') as File;
		const {
			patient_id,
			name_khmer,
			name_latin,
			province_id,
			district_id,
			age,
			dob,
			commune_id,
			village_id,
			other,
			telephone,
			gender,
			old_image
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			name_khmer: false,
			name_latin: false,
			province_id: false,
			district_id: false,
			age: false,
			dob: false,
			commune_id: false,
			village_id: false,
			other: false,
			telephone: false,
			patient_id: false,
			gender: false
		};
		if (!name_khmer.trim()) validErr.name_khmer = true;
		if (!name_latin.trim()) validErr.name_latin = true;
		if (isNaN(+age) || !age.trim()) validErr.age = true;
		if (!dob.trim()) validErr.dob = true;
		if (!gender.trim()) validErr.gender = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		try {
			await db
				.update(patient)
				.set({
					age: Number(age),
					dob: dob,
					gender: gender,
					name_khmer: name_khmer,
					name_latin: name_latin,
					telephone: telephone,
					province_id: Number(province_id),
					district_id: Number(district_id),
					commune_id: Number(commune_id),
					village_id: Number(village_id),
					other: other
				})
				.where(eq(patient.id, +patient_id));

			if (image.size) {
				await db
					.delete(fileOrPicture)
					.where(eq(fileOrPicture.patient_id, +patient_id))
					.catch((e) => console.log(e));
				if (old_image !== '') {
					let filename = (await updateFile(image, old_image)) ?? '';
					await db.insert(fileOrPicture).values({
						filename: filename,
						mimeType: image.type,
						size: image.size,
						lastModified: image.lastModified,
						patient_id: +patient_id
					});
				}
				if (old_image === '') {
					let filename = (await uploadFile(image)) ?? '';
					await db.insert(fileOrPicture).values({
						filename: filename,
						mimeType: image.type,
						size: image.size,
						lastModified: image.lastModified,
						patient_id: +patient_id
					});
				}
			}
		} catch (error) {
			console.log(error);
			return fail(400, { serverError: true });
		}
	},

	delete_patient: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id') ?? '';
		const get_patient = await db.query.patient.findFirst({
			where: eq(patient.id, +id),
			with: { fileOrPicture: true }
		});
		if (get_patient) {
			await db
				.delete(patient)
				.where(eq(patient.id, get_patient.id))
				.catch((e) => console.log(e));
			await deleteFile(get_patient.fileOrPicture?.filename ?? '');
		}
	}
};
