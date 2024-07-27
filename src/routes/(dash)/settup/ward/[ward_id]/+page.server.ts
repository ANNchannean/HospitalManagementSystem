import { db } from '$lib/server/db';
import { bed, department, product, productGroupType, room, ward } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, like } from 'drizzle-orm';

export const load = (async ({ url, params }) => {
	const get_product_type = await db.query.productGroupType.findFirst({
		where: like(productGroupType.group_type, 'room')
	});
	const get_products = await db.query.product.findMany({
		where: eq(product.group_type_id, get_product_type?.id || 0)
	});
	const get_ward = await db.query.ward.findFirst({
		with: {
			room: {
				with: {
					bed: true,
					product: true
				}
			},
			bed: true
		},
		where: eq(ward.id, +params.ward_id)
	});
	const get_wards = await db.query.ward.findMany({
		with: {
			room: {
				with: {
					bed: true,
					product: true
				}
			},
			bed: true
		}
	});
	return {
		get_ward,
		get_products,
		get_wards
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_ward: async ({ request }) => {
		const body = await request.formData();
		const { ward: ward_ } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(ward).values({
			ward: ward_
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
			.where(eq(ward.id, +id));
	},
	delete_ward: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(ward).where(eq(ward.id, +id));
	},
	create_room: async ({ request }) => {
		const body = await request.formData();
		const { room: room_, ward_id } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(room).values({
			room: room_,
			ward_id: +ward_id
		});
	},
	update_room: async ({ request }) => {
		const body = await request.formData();
		const {
			room: room_,
			ward_id,
			product_id,
			room_id
		} = Object.fromEntries(body) as Record<string, string>;
		await db
			.update(room)
			.set({
				room: room_,
				ward_id: +ward_id,
				product_id: +product_id
			})
			.where(eq(room.id, +room_id));
	},

	create_bed: async ({ request }) => {
		const body = await request.formData();
		const { room_id, ward_id, bed: bed_ } = Object.fromEntries(body) as Record<string, string>;
		await db.insert(bed).values({
			room_id: +room_id,
			ward_id: +ward_id,
			bed: bed_
		});
	}
};
