import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const diagnosis = mysqlTable('diagnosis', {
	id: int('id').primaryKey().autoincrement(),
	diagnosis: varchar('diagnosis', { length: 255 }),
	diagnosis_khmer: varchar('diagnosis_khmer', { length: 255 }),
	diagnosis_type_id: int('diagnosis_type_id').references(() => diagnosisType.id)
});

export const diagnosisRelations = relations(diagnosis, ({ one }) => ({
	diagnosisType: one(diagnosisType, {
		fields: [diagnosis.diagnosis_type_id],
		references: [diagnosisType.id]
	})
}));

export const diagnosisType = mysqlTable('diagnosis_type', {
	id: int('id').primaryKey().autoincrement(),
	diagnosis_type: varchar('diagnosis_type', { length: 150 }).notNull()
});

export const diagnosisTypeRelations = relations(diagnosisType, ({ many }) => ({
	diagnosis: many(diagnosis)
}));
