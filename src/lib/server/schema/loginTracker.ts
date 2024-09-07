import { datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const loginTracker = mysqlTable('login_tracker', {
	id: int('id').primaryKey().autoincrement(),
	datetime: datetime('log_datetime', { mode: 'string' }).notNull(),
	version: varchar('version', { length: 255 }).notNull(),
	username: varchar('username', { length: 255 }).notNull(),
	ip_address: varchar('ip_address', { length: 255 }).notNull(),
	mac_address: varchar('mac_address', { length: 255 }).notNull()
});
