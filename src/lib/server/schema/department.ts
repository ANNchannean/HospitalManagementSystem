import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';

export const department = mysqlTable('department', {
	id: int('id').primaryKey().autoincrement(),
	department: varchar('department', { length: 255 }).notNull()
});
export const departmentRelations = relations(department, ({ many }) => ({
	visit: many(visit)
}));
