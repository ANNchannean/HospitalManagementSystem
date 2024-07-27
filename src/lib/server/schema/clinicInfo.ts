import { relations } from 'drizzle-orm';
import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { fileOrPicture } from './fileOrPicture';
export const clinicinfo = mysqlTable('clinicinfo', {
	id: int('id').primaryKey().autoincrement(),
	title_khm: text('title_khmer').notNull(),
	title_eng: text('title_english').notNull(),
	address: text('address').notNull(),
	detail: text('detail').notNull(),
	contact: text('contact').notNull()
});

export const clinicinfoRelations = relations(clinicinfo, ({ one }) => ({
	fileOrPicture: one(fileOrPicture)
}));
