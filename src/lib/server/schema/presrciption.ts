import { float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { product } from './product';
import { relations } from 'drizzle-orm';

export const presrciption = mysqlTable('presrciption', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	product_id: int('product_id').references(() => product.id),
	use: varchar('use', { length: 255 }),
	duration: varchar('duration', { length: 255 }),
	amount: float('amount'),
	morning: float('morning'),
	noon: float('noon'),
	afternoon: float('afternoon'),
	evening: float('evening'),
	night: float('night')
});

export const presrciptionRelations = relations(presrciption, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [presrciption.visit_id]
	}),
	product: one(product, {
		references: [product.id],
		fields: [presrciption.product_id]
	})
}));
