import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { visit } from './visit';

export const adviceTeaching = mysqlTable('advice_teaching', {
	id: int('id').primaryKey().autoincrement(),
	description: text('description'),
	visit_id: int('visit_id').references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const adviceTeachingRelations = relations(adviceTeaching, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [adviceTeaching.visit_id]
	})
}));
