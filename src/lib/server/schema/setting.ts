import { float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const setting = mysqlTable('setting', {
	id: int('id').primaryKey().autoincrement(),
	currency_symbol: varchar('currency_symbol', { length: 3 }).notNull().default('៛'),
	rate_from: float('rate_from').notNull().default(4000),
	currency_from: varchar('currency_from', { length: 3 }).notNull().default('៛'),
	rate_to: float('rate_to').notNull().default(1),
	currency_to: varchar('currency_to', { length: 3 }).notNull().default('$')
});

export const currency = mysqlTable('currency', {
	id: int('id').primaryKey().autoincrement(),
	symbol: varchar('symbol', { length: 3 }).notNull().unique(),
	rate_to: float('rate_to').notNull(),
	rate_from: float('rate_from').notNull()
});
 