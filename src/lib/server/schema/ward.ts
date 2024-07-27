import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

// @_Exam
export const ward = mysqlTable('ward', {
	id: int('id').primaryKey().autoincrement(),
	ward: varchar('ward', { length: 255 }).unique(),
	description: text('description')
});
