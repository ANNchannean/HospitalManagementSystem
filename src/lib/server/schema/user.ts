import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { staff } from './staff';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	username: varchar('username', { length: 255 }).notNull().unique(),
	password_hash: text('password_hash'),
	role: varchar('role', { length: 255 })
		.$type<'ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'NURSE' | 'LABO_TECHICAL' | 'RADIOGRAPHY'>()
		.default('DOCTOR'),
	image: varchar('image', { length: 255 }).notNull(),
	limitview: int('limit_view').notNull().default(20),
	lang: varchar('lang', { length: 255 }).notNull().default('ko'),
	staff_id: int('staff_id').references(() => staff.id, { onDelete: 'no action' })
});

export const userRelations = relations(user, ({ one }) => ({
	staff: one(staff, {
		fields: [user.staff_id],
		references: [staff.id]
	})
}));
