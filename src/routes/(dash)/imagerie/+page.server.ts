import { db } from '$lib/server/db';
import { fileOrPicture, imagerieRequest, product, visit } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, desc, eq } from 'drizzle-orm';
import { deleteFile, uploadFile } from '$lib/server/fileHandle';
import { now_datetime } from '$lib/server/utils';

export const load = (async ({ url }) => {
	const imagerie_request_id = url.searchParams.get('imagerie_request_id') || 0;
	const get_imagers = await db.query.fileOrPicture.findMany({
		where: eq(fileOrPicture.imagerie_request_id, +imagerie_request_id)
	});
	const get_imagerie_templates = await db.query.template.findMany({});
	const get_imagerie_request = await db.query.imagerieRequest.findMany({
		with: {
			visit: {
				with: {
					patient: {
						with: {
							commune: true,
							district: true,
							provice: true,
							village: true
						}
					},
					staff: true
				}
			},
			product: true,
			fileOrPicture: true
		},
		orderBy: desc(imagerieRequest.visit_id)
	});

	const get_imagerie_group = await db.query.imagerieGroup.findMany({
		with: {
			product: {
				orderBy: asc(product.products)
			}
		}
	});
	return {
		get_imagerie_group,
		get_imagerie_request,
		get_imagerie_templates,
		get_imagers
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_imagerie_request: async ({ request }) => {
		const body = await request.formData();
		const visit_id = body.get('visit_id') ?? '';
		const product_id = body.getAll('product_id');
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: { imagerieRequest: true }
		});

		if (get_visit) {
			for (const e of product_id) {
				const is_created = get_visit.imagerieRequest.find((ee) => ee.product_id === +e);
				if (!is_created) {
					await db.insert(imagerieRequest).values({
						product_id: +e,
						visit_id: get_visit?.id
					});
				}
			}
		}
		for (const e of get_visit!.imagerieRequest) {
			const is_created = product_id.find((ee) => +ee === e.product_id);
			if (!is_created) {
				await db.delete(imagerieRequest).where(eq(imagerieRequest.id, e.id));
			}
		}
	},
	update_img_result: async ({ request }) => {
		const body = await request.formData();
		const { id, result } = Object.fromEntries(body) as Record<string, string>;
		const file = body.getAll('file') as File[];
		await db
			.update(imagerieRequest)
			.set({
				result: result,
				status: result.length ? true : false
			})
			.where(eq(imagerieRequest.id, +id));

		for (const e of file) {
			if (e.size) {
				const filename = await uploadFile(e);
				await db.insert(fileOrPicture).values({
					filename: filename,
					lastModified: e.lastModified,
					mimeType: e.type,
					size: e.size,
					imagerie_request_id: +id
				});
			}
			const get_imagerie_request = await db.query.imagerieRequest.findFirst({
				where: eq(imagerieRequest.id, +id),
				with: {
					fileOrPicture: true
				}
			});
			if (get_imagerie_request?.fileOrPicture[0]?.filename && get_imagerie_request.result) {
				await db
					.update(imagerieRequest)
					.set({
						status: true,
						finish_datetime: now_datetime()
					})
					.where(eq(imagerieRequest.id, +id));
			} else {
				await db
					.update(imagerieRequest)
					.set({
						status: false,
						finish_datetime: ''
					})
					.where(eq(imagerieRequest.id, +id));
			}
		}
	},
	delete_picture: async ({ request }) => {
		const body = await request.formData();
		const { file_name, imagerie_request_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(fileOrPicture).where(eq(fileOrPicture.filename, file_name));
		await deleteFile(file_name);
		const get_imagerie_request = await db.query.imagerieRequest.findFirst({
			where: eq(imagerieRequest.id, +imagerie_request_id),
			with: {
				fileOrPicture: true
			}
		});
		if (get_imagerie_request?.fileOrPicture[0]?.filename && get_imagerie_request.result) {
			await db
				.update(imagerieRequest)
				.set({
					status: true,
					finish_datetime: now_datetime()
				})
				.where(eq(imagerieRequest.id, +imagerie_request_id));
		} else {
			await db
				.update(imagerieRequest)
				.set({
					status: false,
					finish_datetime: ''
				})
				.where(eq(imagerieRequest.id, +imagerie_request_id));
		}
	}
};
