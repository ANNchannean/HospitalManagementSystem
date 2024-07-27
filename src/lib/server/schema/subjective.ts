import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar, longtext } from 'drizzle-orm/mysql-core';
import { visit } from './visit';

export const subjective = mysqlTable('subjective', {
	id: int('id').primaryKey().autoincrement(),
	cheif_complaint: longtext('cheif_complaint'),
	past_history: varchar('past_history', { length: 255 }),
	present_illness: varchar('present_illness', { length: 255 }),
	past_medicine_history: varchar('past_medicine_history', { length: 255 }),
	allesgy_medicine: varchar('allesgy_medicine', { length: 255 }),
	surgical_history: varchar('surgical_history', { length: 255 }),
	familly_history: varchar('familly_history', { length: 255 }),
	visit_id: int('visit_id')
		.references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique()
});

export const subjectiveRelations = relations(subjective, ({ one, many }) => ({
	visit: one(visit, {
		fields: [subjective.visit_id],
		references: [visit.id]
	})
}));
