import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { progressNote, visit } from './visit';
import { relations } from 'drizzle-orm';

export const accessment = mysqlTable('accessment', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	diagnosis_or_problem: text('diagnosis_or_problem'),
	differential_diagnosis: text('differential_diagnosis')
});
export const accessmentRelations = relations(accessment, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [accessment.visit_id]
	}),
	progressNote: one(progressNote, {
		references: [progressNote.id],
		fields: [accessment.progress_note_id]
	})
}));
