import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar, datetime, text, boolean } from 'drizzle-orm/mysql-core';
import { patient } from './patient';
import { department } from './department';
import { staff } from './staff';
import { subjective } from './subjective';
import { vitalSign } from './vitalSign';
import { physicalExam } from './physicaleExam';
import { laboratory, laboratoryRequest } from './laboratory';
import { imagerieRequest } from './imagerie';
import { billing } from './billing';
import { presrciption } from './presrciption';
import { service } from './service';
import { document } from './document';
import { vaccine } from './vaccine';
import { bed } from './wardRoomBed';
import { remark } from './remark';
import { accessment } from './accessment';

export const visit = mysqlTable('visit', {
	id: int('id').primaryKey().autoincrement(),
	date_checkup: datetime('date_checkup', { mode: 'string' }).notNull(),
	patient_id: int('patient_id')
		.references(() => patient.id, { onDelete: 'cascade' })
		.notNull(),
	department_id: int('department_id')
		.references(() => department.id)
		.notNull(),
	staff_id: int('staff_id')
		.references(() => staff.id)
		.notNull(),
	checkin_type: varchar('checkin_type', { length: 255 }).notNull().$type<'IPD' | 'OPD'>(),
	etiology: varchar('etiology', { length: 255 }).notNull(),
	transfer: boolean('transfer').default(false).notNull(),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade'
	})
});
export const nursingProcess = mysqlTable('nursing_process', {
	id: int('id').primaryKey().autoincrement(),
	datetime: datetime('datetime', { mode: 'string' }),
	accessment: varchar('accessment', { length: 255 }),
	health_problems: text('health_problems'),
	actions: varchar('actions', { length: 255 }),
	evolution: varchar('evolution', { length: 255 }),
	nursing_sign: int('nursing_sign').references(() => staff.id),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade'
	})
});

export const visitRelations = relations(visit, ({ one, many }) => ({
	progressNote: one(progressNote, {
		fields: [visit.progress_note_id],
		references: [progressNote.id]
	}),
	staff: one(staff, {
		fields: [visit.staff_id],
		references: [staff.id]
	}),
	patient: one(patient, {
		fields: [visit.patient_id],
		references: [patient.id]
	}),
	department: one(department, {
		fields: [visit.department_id],
		references: [department.id]
	}),
	subjective: one(subjective),
	vitalSign: one(vitalSign, {
		fields: [visit.id],
		references: [vitalSign.visit_id]
	}),
	physicalExam: many(physicalExam),
	laboratoryRequest: many(laboratoryRequest),
	presrciption: many(presrciption),
	service: one(service),
	imagerieRequest: many(imagerieRequest),
	laboratory: one(laboratory),
	billing: one(billing),
	document: many(document),
	vaccine: many(vaccine),
	remark: one(remark),
	accessment: one(accessment)
}));

export const progressNote = mysqlTable('progress_note', {
	id: int('id').primaryKey().autoincrement(),
	date_checkup: datetime('date_checkup', { mode: 'string' }).notNull(),
	date_checkout: datetime('date_checkout', { mode: 'string' }),
	staff_id: int('staff_id')
		.references(() => staff.id)
		.notNull(),
	etiology: varchar('etiology', { length: 255 }).notNull(),
	department_id: int('department_id')
		.references(() => department.id)
		.notNull(),
	patient_id: int('patient_id')
		.references(() => patient.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	bed_id: int('bed_id')
		.references(() => bed.id)
		.notNull()
});

export const progressNoteRelations = relations(progressNote, ({ one, many }) => ({
	visit: many(visit),
	nursingProcess: many(nursingProcess),
	vitalSign: many(vitalSign),
	patient: one(patient, {
		fields: [progressNote.patient_id],
		references: [patient.id]
	}),
	bed: one(bed, {
		fields: [progressNote.bed_id],
		references: [bed.id]
	}),
	staff: one(staff, {
		fields: [progressNote.staff_id],
		references: [staff.id]
	}),
	department: one(department, {
		fields: [progressNote.department_id],
		references: [department.id]
	}),
	service: many(service)
}));
export const nursingProcessRelations = relations(nursingProcess, ({ one }) => ({
	staff: one(staff, {
		fields: [nursingProcess.nursing_sign],
		references: [staff.id]
	}),
	progressNote: one(progressNote, {
		fields: [nursingProcess.progress_note_id],
		references: [progressNote.id]
	})
}));
