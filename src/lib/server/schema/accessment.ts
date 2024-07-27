import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { relations } from 'drizzle-orm';

export const accessment = mysqlTable('accessment', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, { onDelete: 'cascade' }),
	diagnosis_or_problem: text('diagnosis_or_problem'),
	differential_diagnosis: text('differential_diagnosis')
});
export const accessmentRelations = relations(accessment, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [accessment.visit_id]
	})
}));
