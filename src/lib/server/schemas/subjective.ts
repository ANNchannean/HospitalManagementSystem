import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar, text } from 'drizzle-orm/mysql-core';
import { visit } from './visit';

export const subjective = mysqlTable('subjective', {
	id: int('id').primaryKey().autoincrement(),
	cheif_complaint: text('cheif_complaint'),
	current_medication: varchar('current_medication', { length: 255 }),
	history_of_present_illness: varchar('history_of_present_illness', { length: 255 }),
	past_medical_history: text('past_medical_history'),
	allesgy_medicine: varchar('allesgy_medicine', { length: 255 }),
	surgical_history: varchar('surgical_history', { length: 255 }),
	family_and_social_history: varchar('family_and_social_history', { length: 255 }),
	visit_id: int('visit_id')
		.references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique()
});

export const subjectiveRelations = relations(subjective, ({ one }) => ({
	visit: one(visit, {
		fields: [subjective.visit_id],
		references: [visit.id]
	})
}));
