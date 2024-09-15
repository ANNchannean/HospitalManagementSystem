import { datetime, float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { product } from './product';
import { relations } from 'drizzle-orm';
import { user } from './user';

export const presrciption = mysqlTable('presrciption', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	product_id: int('product_id').references(() => product.id),
	use: varchar('use', { length: 150 }),
	duration: varchar('duration', { length: 150 }),
	amount: float('amount'),
	morning: float('morning'),
	noon: float('noon'),
	afternoon: float('afternoon'),
	evening: float('evening'),
	night: float('night')
});

export const presrciptionRelations = relations(presrciption, ({ one, many }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [presrciption.visit_id]
	}),
	product: one(product, {
		references: [product.id],
		fields: [presrciption.product_id]
	}),
	activePresrciption: many(activePresrciption)
}));

export const activePresrciption = mysqlTable('active_presrciption', {
	id: int('id').primaryKey().autoincrement(),
	active_for: varchar('active_for', { length: 100 }).notNull(),
	datetime: datetime('datetime', { mode: 'string' }).notNull(),
	presrciption_id: int('presrciption_id').references(() => presrciption.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	user_id: varchar('user_id', { length: 255 }).references(() => user.id)
});

export const activePresrciptionRelations = relations(activePresrciption, ({ one }) => ({
	presrciption: one(presrciption, {
		references: [presrciption.id],
		fields: [activePresrciption.presrciption_id]
	}),
	user: one(user, {
		references: [user.id],
		fields: [activePresrciption.user_id]
	})
}));
