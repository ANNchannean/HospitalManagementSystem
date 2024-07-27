import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const room = mysqlTable('room', {
	id: int('id').primaryKey().autoincrement(),
	room: varchar('room', { length: 255 }).unique(),
	description: text('description')
});
