import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const use = mysqlTable('use', {
	id: int('id').primaryKey().autoincrement(),
	description: varchar('description', { length: 255 })
});
