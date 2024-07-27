import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const duration = mysqlTable('duration', {
	id: int('id').primaryKey().autoincrement(),
	description: varchar('description', { length: 255 })
});
