import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { relations } from 'drizzle-orm';

// @_Exam
export const remark = mysqlTable('remark', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	description: text('description')
});
export const remarkRelations = relations(remark, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [remark.visit_id]
	})
}));
