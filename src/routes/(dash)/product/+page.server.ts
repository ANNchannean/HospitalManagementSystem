import { db } from '$lib/server/db';
import { fileOrPicture, product, productGroupType } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { deleteFile, updateFile, uploadFile } from '$lib/server/fileHandle';

export const load = (async ({ url }) => {
	const group_type_id = url.searchParams.get('group_type_id') || '';
	const q = url.searchParams.get('q') || '';
	const get_product_group_type = await db.query.productGroupType.findMany({
		with: {
			unit: true
		}
	});
	const get_units = await db.query.unit.findMany({});
	const get_products = await db.query.product.findMany({
		where: and(
			group_type_id ? eq(product.group_type_id, +group_type_id) : undefined,
			or(like(product.products, `%${q}%`))
		),
		with: {
			unit: true,
			parameter: true,
			productGroupType: true,
			fileOrPicture: true
		},
		orderBy: asc(product.products)
	});
	return {
		get_products,
		get_product_group_type,
		get_units
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_product: async ({ request }) => {
		const body = await request.formData();
		const { name_product, price, unit_id, group_type_id, generic_name } = Object.fromEntries(
			body
		) as Record<string, string>;
		const file = body.get('image') as File;
		const validErr = {
			name_product: false,
			price: false,
			unit_id: false,
			group_type_id: false
		};
		if (!name_product.trim()) validErr.name_product = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		const datetime = now_datetime();
		await db
			.insert(product)
			.values({
				price: Number(price),
				products: name_product,
				unit_id: +unit_id || undefined,
				group_type_id: +group_type_id || undefined,
				generic_name: generic_name,
				create_at: datetime
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
		if (file.size) {
			const get_product = await db.query.product.findFirst({
				where: eq(product.create_at, datetime)
			});
			await db.insert(fileOrPicture).values({
				filename: await uploadFile(file),
				product_id: get_product?.id
			});
		}
	},
	update_product: async ({ request }) => {
		const body = await request.formData();
		const { name_product, price, product_id, unit_id, group_type_id, generic_name, filename } =
			Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			name_product: false,
			product_id: false,
			price: false
		};
		const file = body.get('image') as File;
		if (!name_product.trim()) validErr.name_product = true;
		if (isNaN(+price) || !price.trim()) validErr.price = true;
		if (isNaN(+product_id)) validErr.product_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(product)
			.set({
				price: Number(price),
				products: name_product,
				group_type_id: +group_type_id || null,
				unit_id: +unit_id || null,
				generic_name: generic_name
			})
			.where(eq(product.id, Number(product_id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
		if (file.size) {
			const get_fileOrPicture = await db.query.fileOrPicture.findFirst({
				where: eq(fileOrPicture.product_id, +product_id)
			});
			if (get_fileOrPicture) {
				await db
					.update(fileOrPicture)
					.set({
						filename: await updateFile(file, filename)
					})
					.where(eq(fileOrPicture.product_id, +product_id));
			} else {
				await db.insert(fileOrPicture).values({
					filename: await uploadFile(file),
					product_id: +product_id
				});
			}
		}
	},
	delete_product: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		const get_product = await db.query.product.findFirst({
			where: eq(product.id, +id),
			with: {
				fileOrPicture: true
			}
		});
		await db
			.delete(product)
			.where(eq(product.id, Number(id)))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
		if (get_product?.fileOrPicture) {
			await deleteFile(get_product?.fileOrPicture?.filename as string);
		}
	},
	create_product_group: async ({ request }) => {
		const body = await request.formData();
		const { product_group } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(productGroupType)
			.values({
				group_type: product_group
			})
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	},
	update_product_group: async ({ request }) => {
		const body = await request.formData();
		const { product_group, id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(productGroupType)
			.set({
				group_type: product_group
			})
			.where(eq(productGroupType.id, +id))
			.catch((e) => {
				console.log(e);
				return fail(500, { serverError: true });
			});
	}
};
