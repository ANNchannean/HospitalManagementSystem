import { relations } from 'drizzle-orm';
import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { fileOrPicture } from './fileOrPicture';
export const clinicinfo = mysqlTable('clinicinfo', {
	id: int('id').primaryKey().autoincrement(),
	title_khm: text('title_khmer'),
	title_eng: text('title_english'),
	address: text('address'),
	detail: text('detail'),
	contact: text('contact')
});

export const clinicinfoRelations = relations(clinicinfo, ({ one }) => ({
	fileOrPicture: one(fileOrPicture)
}));
