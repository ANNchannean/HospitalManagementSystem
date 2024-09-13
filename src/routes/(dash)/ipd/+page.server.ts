import { db } from '$lib/server/db';
import { department, staff, patient, visit, progressNote, billing } from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq, isNull } from 'drizzle-orm';
import { now_datetime } from '$lib/server/utils';
import { logErrorMessage } from '$lib/server/telegram';
import { fail, redirect } from '@sveltejs/kit';
import { preBilling } from '$lib/server/models';

export const load = (async ({ url, parent }) => {
	await parent();
	const progress_note_id = url.searchParams.get('progress_note_id') ?? '';
	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, +progress_note_id || 0),
		with: {
			bed: {
				with: {
					room: {
						with: {
							bed: true,
							product: true
						}
					}
				}
			}
		}
	});
	const get_progress_notes = await db.query.progressNote.findMany({
		where: isNull(progressNote.date_checkout),
		with: {
			bed: {
				with: {
					room: {
						with: {
							bed: true,
							product: true
						}
					}
				}
			},
			patient: true
		}
	});
	const patient_id = url.searchParams.get('patient_id') ?? '';
	if (!url.searchParams.has('patient_id')) redirect(303, '/patient/ipd');
	const visit_id = url.searchParams.get('visit_id') ?? '';
	const get_visit = await db.query.visit.findFirst({
		where: eq(visit.id, +visit_id),
		with: {
			vitalSign: true,
			billing: true
		}
	});
	const get_departments = await db.query.department.findMany({
		orderBy: asc(department.department)
	});
	const get_staffs = await db.query.staff.findMany({
		orderBy: asc(staff.name)
	});
	const get_patient = await db.query.patient.findFirst({
		where: eq(patient.id, Number(patient_id)),
		with: {
			provice: true,
			district: true,
			commune: true,
			village: true
		}
	});
	const get_wards = await db.query.ward.findMany({
		with: {
			room: {
				with: {
					product: true,
					bed: {
						with: {
							room: {
								with: {
									product: true
								}
							},
							ward: true
						}
					}
				}
			}
		}
	});
	const get_beds = await db.query.bed.findMany({
		with: {
			room: {
				with: {
					product: true
				}
			},
			ward: true
		}
	});
	const get_words = await db.query.words.findMany();
	return {
		get_patient,
		get_staffs,
		get_departments,
		get_words,
		get_wards,
		get_visit,
		get_progress_note,
		get_progress_notes,
		get_beds
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create_visit_ipd: async ({ request }) => {
		const body = await request.formData();
		const created_at = now_datetime();
		const {
			patient_id,
			staff_id,
			department_id,
			etiology,
			bed_id,
			visit_id,
			progress_note_id,
			billing_id
		} = Object.fromEntries(body) as Record<string, string>;
		const validErr = {
			patient_id: false,
			staff_id: false,
			department_id: false,
			etiology: false,
			bed_id: false
		};
		if (!bed_id) validErr.bed_id = true;
		if (!etiology) validErr.etiology = true;
		if (!patient_id) validErr.patient_id = true;
		if (!department_id) validErr.department_id = true;
		if (!staff_id) validErr.staff_id = true;
		if (Object.values(validErr).includes(true)) return fail(400, validErr);
		if (progress_note_id) {
			await db
				.update(progressNote)
				.set({
					date_checkup: created_at,
					bed_id: +bed_id,
					staff_id: Number(staff_id),
					department_id: Number(department_id),
					etiology: etiology
				})
				.where(eq(progressNote.id, +progress_note_id))
				.catch((e) => {
					logErrorMessage(e);
				});
			redirect(303, `/ipd/${progress_note_id}/progress-note`);
		} else {
			const progress_note_id = await db
				.insert(progressNote)
				.values({
					date_checkup: created_at,
					patient_id: +patient_id,
					bed_id: +bed_id,
					staff_id: Number(staff_id),
					department_id: Number(department_id),
					etiology: etiology
				})
				.$returningId();

			if (visit_id) {
				await db
					.update(visit)
					.set({
						transfer: true,
						progress_note_id: progress_note_id[0].id
					})
					.where(eq(visit.id, +visit_id))
					.catch((e) => {
						logErrorMessage(e);
					});
				await db
					.update(billing)
					.set({
						status: 'active',
						checkin_type: 'IPD'
					})
					.where(eq(billing.id, +billing_id))
					.catch((e) => {
						logErrorMessage(e);
					});
			} else {
				const id: { id: number }[] = await db
					.insert(visit)
					.values({
						checkin_type: 'IPD',
						patient_id: Number(patient_id),
						date_checkup: created_at,
						staff_id: Number(staff_id),
						department_id: Number(department_id),
						etiology: etiology,
						progress_note_id: progress_note_id[0].id
					})
					.$returningId()
					.catch((e) => {
						logErrorMessage(e);
						return [];
					});

				if (id[0].id) {
					await preBilling({ visit_id: id, progress_id: undefined, checkin_type: 'IPD' });
				}
			}
			await preBilling({
				visit_id: undefined,
				progress_id: progress_note_id[0].id,
				checkin_type: 'IPD'
			});
			redirect(303, `/ipd/${progress_note_id[0].id}/progress-note`);
		}
	}
};
