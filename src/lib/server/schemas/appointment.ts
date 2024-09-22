import { datetime, int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { progressNote, visit } from './visit';
import { relations } from 'drizzle-orm';

export const appointment = mysqlTable('appointment', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	date: datetime('date', { mode: 'string' }),
	description: text('description')
});
export const appointmentRelations = relations(appointment, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [appointment.visit_id]
	}),
	progressNote: one(progressNote, {
		references: [progressNote.id],
		fields: [appointment.progress_note_id]
	})
}));
