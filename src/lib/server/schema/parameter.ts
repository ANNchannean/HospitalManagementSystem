import { relations } from 'drizzle-orm';
import { int, float, mysqlTable, varchar, longtext } from 'drizzle-orm/mysql-core';
import { product } from './product';
import { unit } from './unit';
import { laboratoryResult } from './laboratory';

export const parameter = mysqlTable('parameter', {
	id: int('id').primaryKey().autoincrement(),
	parameter: varchar('parameter', { length: 255 }),
	description: longtext('description'),
	gender: varchar('gender', { length: 10 }),
	sign: varchar('sign', { length: 10 }).default('-').notNull(),
	unit_id: int('unit_id').references(() => unit.id),
	mini: float('mini'),
	maxi: float('maxi'),
	product_id: int('product_id').references(() => product.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});
export const parameterRelations = relations(parameter, ({ one, many }) => ({
	product: one(product, {
		fields: [parameter.product_id],
		references: [product.id]
	}),
	unit: one(unit, {
		fields: [parameter.unit_id],
		references: [unit.id]
	}),
	laboratoryResult: many(laboratoryResult)
}));
