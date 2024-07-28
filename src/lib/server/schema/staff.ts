import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { vitalSign } from './vitalSign';
import { user } from './user';

export const staff = mysqlTable('staff', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	staff_type: varchar('staff_type', { length: 255 })
		.$type<'ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'NURSE' | 'LABO_TECHICAL' | 'RADIOGRAPHY'>()
		.default('DOCTOR')
		.notNull(),
	gender: varchar('gender', { length: 255 }).notNull(),
	specific: varchar('specific', { length: 255 })
});
export const staffRelations = relations(staff, ({ one, many }) => ({
	visit: many(visit),
	vitalSign: many(vitalSign),
	user: one(user)
}));
