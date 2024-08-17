import { db } from '$lib/server/db';
import { billing, document, formDocument, visit } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';

export const load = (async ({ parent }) => {
	await parent();
	const get_departments = await db.query.department.findMany();
	const get_staffs = await db.query.staff.findMany();
	const get_visits = await db.query.visit.findMany({
		where: eq(visit.checkin_type, 'OPD'),
		with: {
			staff: true,
			patient: true,
			department: true,
			billing: true,
			document: true
		},
		orderBy: desc(visit.date_checkup)
	});
	const get_form_documents = await db.query.formDocument.findMany();
	return {
		get_visits,
		get_departments,
		get_staffs,
		get_form_documents
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	send_to_ipd: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				checkin_type: 'IPD'
			})
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_etiology: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const etiology = body.get('etiology') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				etiology: etiology.toString()
			})
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_department: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const department_id = body.get('department_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				department_id: +department_id
			})
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	update_staff: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id');
		const staff_id = body.get('staff_id') || '';
		if (!id || isNaN(+id)) return fail(303, { idErr: true });
		await db
			.update(visit)
			.set({
				staff_id: +staff_id
			})
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	process_billing: async ({ request }) => {
		const body = await request.formData();
		const billing_id = body.get('id');
		if (!billing_id || isNaN(+billing_id)) return fail(303, { idErr: true });
		const get_billing = await db.query.billing.findFirst({
			where: eq(billing.id, +billing_id)
		});
		const status = get_billing?.status === 'active' ? 'process' : 'active';
		await db
			.update(billing)
			.set({
				status: status,
				checkin_type: 'OPD'
			})
			.where(eq(billing.id, +billing_id))
			.catch((e) => {
				logErrorMessage(e);
			});
	},
	create_document: async ({ request }) => {
		const body = await request.formData();
		const document_title = body.getAll('document_title') as [];
		const visit_id = body.get('visit_id') as string;
		const get_visit = await db.query.visit.findFirst({
			where: eq(visit.id, +visit_id),
			with: {
				document: true
			}
		});

		for (const e of document_title) {
			const get_form_document = await db.query.formDocument.findFirst({
				where: eq(formDocument.title, e)
			});
			const is_created = get_visit?.document.some((e) => e.title === get_form_document?.title);
			if (get_form_document && !is_created) {
				await db
					.insert(document)
					.values({
						visit_id: +visit_id,
						content: get_form_document.content,
						title: get_form_document.title,
						datetime: now_datetime()
					})
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
		for (const e of get_visit?.document || []) {
			const is_created = document_title.some((ee) => ee === e.title);
			if (!is_created) {
				await db
					.delete(document)
					.where(eq(document.id, e.id))
					.catch((e) => {
						logErrorMessage(e);
					});
			}
		}
	},
	delete_visit: async ({ request }) => {
		const body = (await request.formData()).entries();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db
			.delete(visit)
			.where(eq(visit.id, +id))
			.catch((e) => {
				logErrorMessage(e);
			});
	}
};
