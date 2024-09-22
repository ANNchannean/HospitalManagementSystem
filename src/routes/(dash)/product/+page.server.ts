import { db } from '$lib/server/db';
import { fileOrPicture, inventory, product, productGroupType } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { and, asc, eq, like, or } from 'drizzle-orm';
import { now_datetime, pagination } from '$lib/server/utils';
import { deleteFile, updateFile, uploadFile } from '$lib/server/upload/fileHandle';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ url, parent }) => {
	await parent();
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 10;
	const get_currency = await db.query.currency.findFirst({});
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
			fileOrPicture: true,
			inventory: {
				where: eq(inventory.outstock, false),
				with: {
					subUnit: {
						with: {
							unit: true
						}
					}
				}
			}
		},
		orderBy: asc(product.products),
		limit: pagination(page, limit).limit,
		offset: pagination(page, limit).offset
	});
	const get_products_lenght = await db.query.product.findMany({
		where: and(
			group_type_id ? eq(product.group_type_id, +group_type_id) : undefined,
			or(like(product.products, `%${q}%`))
		)
	});
	return {
		get_products,
		get_product_group_type,
		get_units,
		get_currency,
		items: get_products_lenght.length
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
				logErrorMessage(e);
			});
		if (file.size) {
			const get_product = await db.query.product.findFirst({
				where: eq(product.create_at, datetime)
			});
			await db
				.insert(fileOrPicture)
				.values({
					filename: await uploadFile(file),
					product_id: get_product?.id
				})
				.catch((e) => {
					logErrorMessage(e);
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
				logErrorMessage(e);
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
					.where(eq(fileOrPicture.product_id, +product_id))
					.catch((e) => {
						logErrorMessage(e);
					});
			} else {
				await db
					.insert(fileOrPicture)
					.values({
						filename: await uploadFile(file),
						product_id: +product_id
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
	},
	delete_product: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			serverError: false
		};
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
				logErrorMessage(e);
			});
		if (get_product?.fileOrPicture) {
			await deleteFile(get_product?.fileOrPicture?.filename as string).catch((e) => {
				logErrorMessage(e);
			});
		}
		if (Object.values(validErr).includes(true)) return fail(500, validErr);
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
				logErrorMessage(e);
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
				logErrorMessage(e);
			});
	},
	delete_product_group: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		if (isNaN(+id)) return fail(400, { id: true });
		await db
			.delete(productGroupType)
			.where(eq(productGroupType.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
