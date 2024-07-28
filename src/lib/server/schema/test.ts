import { decimal, float, int, mysqlTable } from 'drizzle-orm/mysql-core';

export const test = mysqlTable('test', {
	id: int('id').primaryKey().autoincrement(),
	float: float('float'),
	decimal: decimal('decimal', { precision: 4, scale: 2 }).$type<number>()
});
