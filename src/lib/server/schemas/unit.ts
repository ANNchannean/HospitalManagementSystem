import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { productGroupType } from './productGroupType';
import { relations } from 'drizzle-orm';

export const unit = mysqlTable('unit', {
	id: int('id').primaryKey().autoincrement(),
	unit: varchar('unit', { length: 255 }),
	vaccine_dose: text('vaccine_dose'),
	product_group_type_id: int('product_group_type_id').references(() => productGroupType.id)
});
export const unitRelations = relations(unit, ({ one }) => ({
	productGroupType: one(productGroupType, {
		fields: [unit.product_group_type_id],
		references: [productGroupType.id]
	})
}));
