import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, varchar, datetime, date } from 'drizzle-orm/mysql-core';
import { village, commune, district, provice } from './address';

import { visit } from './visit';
import { fileOrPicture } from './fileOrPicture';

// @_Patient
export const patient = mysqlTable('patient', {
	id: int('id').primaryKey().autoincrement(),
	name_khmer: varchar('name_khmer', { length: 50 }).notNull(),
	name_latin: varchar('name_latin', { length: 50 }).notNull(),
	gender: varchar('gender', { length: 10 }).notNull(),
	dob: date('dob', { mode: 'string' }).notNull(),
	age: int('age').notNull(),
	telephone: varchar('telephone', { length: 50 }),
	other: text('other'),
	village_id: int('village_id').references(() => village.id, { onDelete: 'set null' }),
	commune_id: int('commune_id').references(() => commune.id, { onDelete: 'set null' }),
	district_id: int('district_id').references(() => district.id, { onDelete: 'set null' }),
	province_id: int('province_id').references(() => provice.id, { onDelete: 'set null' }),
	created_at: datetime('created_at', { mode: 'string' }).notNull()
});
export const patientRelations = relations(patient, ({ one, many }) => ({
	provice: one(provice, {
		fields: [patient.province_id],
		references: [provice.id]
	}),
	district: one(district, {
		fields: [patient.district_id],
		references: [district.id]
	}),
	commune: one(commune, {
		fields: [patient.commune_id],
		references: [commune.id]
	}),
	village: one(village, {
		fields: [patient.village_id],
		references: [village.id]
	}),
	visit: many(visit),
	fileOrPicture: one(fileOrPicture)
}));
