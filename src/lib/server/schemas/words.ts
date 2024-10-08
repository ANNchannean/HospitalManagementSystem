import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const words = mysqlTable('words', {
	id: int('id').primaryKey().autoincrement(),
	type: varchar('type', { length: 100 }).notNull(),
	text: text('text').notNull()
});
