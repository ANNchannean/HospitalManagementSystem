import { db } from '$lib/server/db';
import { parameter, product } from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { logErrorMessage } from '$lib/server/telegram/logErrorMessage';

export const load = (async ({ params }) => {
	const [get_lab_groups, get_units, get_parameters, get_product_labo] = await Promise.all([
		await db.query.laboratoryGroup.findMany({}),
		await db.query.unit.findMany({}),
		await db.query.parameter.findMany({
			where: eq(parameter.product_id, Number(params.id)),
			with: { unit: true },
			orderBy: asc(parameter.id)
		}),
		await db.query.product.findFirst({
			with: {
				laboratoryGroup: true,
				productGroupType: true
			},
			where: eq(product.id, Number(params.id))
		})
	]);
	return {
		get_product_labo: get_product_labo,
		get_lab_groups: get_lab_groups,
		get_units: get_units,
		get_parameters: get_parameters
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update_parameter: async ({ request }) => {
		const body = await request.formData();
		const { parameter_, description, unit_id, gender, mini, parameter_id, maxi, sign } =
			Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			parameter_: false,
			description: false,
			unit_id: false,
			gender: false,
			mini: false,
			parameter_id: false,
			maxi: false,
			sign: false
		};
		if (!parameter_.trim()) validErr.parameter_ = true;
		if (!gender.trim()) validErr.gender = true;
		if (isNaN(+parameter_id)) validErr.parameter_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		await db
			.update(parameter)
			.set({
				description: description,
				gender: gender,
				maxi: +maxi,
				mini: +mini,
				sign: sign,
				parameter: parameter_,
				unit_id: +unit_id || undefined
			})
			.where(eq(parameter.id, Number(parameter_id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	delete_parameter: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(parameter)
			.where(eq(parameter.id, Number(id)))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
