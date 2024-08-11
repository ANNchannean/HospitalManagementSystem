import { datetime, int, mysqlTable, text } from 'drizzle-orm/mysql-core';

export const logError = mysqlTable('log_error', {
	id: int('id').primaryKey().autoincrement(),
	log_datetime: datetime('log_datetime', { mode: 'string' }).notNull(),
	log: text('log')
});
