import { boolean, float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const setting = mysqlTable('setting', {
	id: int('id').primaryKey().autoincrement(),
	print_bill:boolean('print_bill').default(false).notNull()
});

export const currency = mysqlTable('currency', {
	id: int('id').primaryKey().autoincrement(),
	currency_symbol: varchar('currency_symbol', { length: 5 }).notNull().unique(),
	currency: varchar('currency', { length: 5 }).notNull().unique(),
	currency_rate: float('currency_rate').notNull().unique(),
	exchang_to: varchar('exchang_to', { length: 5 }).notNull().unique(),
	exchang_rate: float('exchang_rate').notNull()
});
