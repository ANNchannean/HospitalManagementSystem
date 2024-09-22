import { int, mysqlTable, text, longtext } from 'drizzle-orm/mysql-core';

// @_Template
export const template = mysqlTable('template', {
	id: int('id').primaryKey().autoincrement(),
	diagnosis: text('diagnosis'),
	template: longtext('template')
});
