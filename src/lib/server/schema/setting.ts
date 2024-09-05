import { float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const setting = mysqlTable('setting', {
	id: int('id').primaryKey().autoincrement()
});

export const currency = mysqlTable('currency', {
	id: int('id').primaryKey().autoincrement(),
	symbol: varchar('symbol', { length: 3 }).notNull().unique(),
	from_symbol: varchar('from_symbol', { length: 3 }).notNull().unique(),
	to_symbol: varchar('to_symbol', { length: 3 }).notNull().unique().default('$'),
	rate_to: float('rate_to').notNull(),
	rate_from: float('rate_from').notNull(),
	dialy_rate: float('dialy_rate').notNull()
});
