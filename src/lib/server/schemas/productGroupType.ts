import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { unit } from './unit';
import { product } from './product';

export const productGroupType = mysqlTable('product_group_type', {
	id: int('id').primaryKey().autoincrement(),
	group_type: varchar('group_type', { length: 100 }).notNull()
});
export const productGroupTypeRelations = relations(productGroupType, ({ many }) => ({
	product: many(product),
	unit: many(unit)
}));
