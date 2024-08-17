import { db } from '$lib/server/db';
import { bed, product, productGroupType, room, ward } from '$lib/server/schema';
import { logErrorMessage } from '$lib/server/telegram';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_product_type = await db.query.productGroupType.findFirst({
		where: eq(productGroupType.group_type, 'Room')
	});
	const get_products = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0)
	});
	const wards = await db.query.ward.findMany({
		with: {
			room: {
				with: {
					product: true,
					bed: true
				}
			},
			bed: true
		}
	});
	return {
		wards,
		get_products
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_ward: async ({ request }) => {
		const body = await request.formData();
		const { ward: ward_ } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(ward)
			.values({
				ward: ward_
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_ward: async ({ request }) => {
		const body = await request.formData();
		const { ward: ward_, id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(ward)
			.set({
				ward: ward_
			})
			.where(eq(ward.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_ward: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(ward)
			.where(eq(ward.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	create_room: async ({ request }) => {
		const body = await request.formData();
		const { room: room_, ward_id, product_id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(room)
			.values({
				room: room_,
				ward_id: +ward_id,
				product_id: +product_id
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	},

	create_bed: async ({ request }) => {
		const body = await request.formData();
		const { room_id, ward_id, bed: bed_ } = Object.fromEntries(body) as Record<string, string>;
		await db
			.insert(bed)
			.values({
				room_id: +room_id,
				ward_id: +ward_id,
				bed: bed_
			})
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
