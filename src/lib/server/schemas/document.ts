import { datetime, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { relations } from 'drizzle-orm';
import { fileOrPicture } from './fileOrPicture';
export const formDocument = mysqlTable('form_document', {
	id: int('id').primaryKey().autoincrement(),
	datetime: datetime('datetime', { mode: 'string' }),
	title: varchar('title', { length: 150 }),
	content: text('content')
});
export const document = mysqlTable('document', {
	id: int('id').primaryKey().autoincrement(),
	datetime: datetime('datetime', { mode: 'string' }),
	title: varchar('title', { length: 150 }),
	content: text('content'),
	visit_id: int('visit_id')
		.references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull()
});
export const documentRelations = relations(document, ({ one }) => ({
	visit: one(visit, {
		fields: [document.visit_id],
		references: [visit.id]
	}),
	fileOrPicture: one(fileOrPicture)
}));
