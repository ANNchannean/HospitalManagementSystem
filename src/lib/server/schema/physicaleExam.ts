import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';

export const exam = mysqlTable('exam', {
	id: int('id').primaryKey().autoincrement(),
	examination: varchar('examination', { length: 255 })
});

export const physical = mysqlTable('physical', {
	id: int('id').primaryKey().autoincrement(),
	physical: varchar('physical', { length: 255 }),
	exam_id: int('exam_id').references(() => exam.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const physicalExam = mysqlTable('physical_exam', {
	id: int('id').primaryKey().autoincrement(),
	physical_id: int('physical_id').references(() => physical.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	result: varchar('result', { length: 255 }),
	visit_id: int('visit_id').references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const examRelations = relations(exam, ({ many }) => ({
	physical: many(physical)
}));

export const physicalRelations = relations(physical, ({ one }) => ({
	exam: one(exam, {
		fields: [physical.exam_id],
		references: [exam.id]
	})
}));
export const physicalExamRelations = relations(physicalExam, ({ one }) => ({
	visit: one(visit, {
		fields: [physicalExam.visit_id],
		references: [visit.id]
	}),
	physical: one(physical, {
		fields: [physicalExam.physical_id],
		references: [physical.id]
	})
}));
