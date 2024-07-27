import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { vaccineType } from './vaccineType';

export const vaccine = mysqlTable('vaccine', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id),
	vaccine_type_id: int('vaccine_type_id').references(() => vaccineType.id),
	discription: varchar('discription', { length: 255 })
});
export const vaccineRelations = relations(vaccine, ({ one }) => ({
	vaccineType: one(vaccineType, {
		fields: [vaccine.vaccine_type_id],
		references: [vaccineType.id]
	})
}));
