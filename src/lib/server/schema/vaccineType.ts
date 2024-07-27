import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { vaccine } from './vaccine';

export const vaccineType = mysqlTable('vaccine_type', {
	id: int('id').primaryKey().autoincrement(),
	type: varchar('department', { length: 255 }).notNull()
});

export const vaccineTypeRelations = relations(vaccineType, ({ many }) => ({
	vaccine: many(vaccine)
}));
