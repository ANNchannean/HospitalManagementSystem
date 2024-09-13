import { datetime, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { patient } from './patient';
import { relations } from 'drizzle-orm';

export const pos = mysqlTable('pos', {
	id: int('id').primaryKey().autoincrement(),
	patient_id: int('patient_id').references(() => patient.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	datetime: datetime('datetime', { mode: 'string' }).notNull()
});
export const posRelations = relations(pos, ({ one }) => ({
	patient: one(patient, {
		fields: [pos.patient_id],
		references: [patient.id]
	})
}));
