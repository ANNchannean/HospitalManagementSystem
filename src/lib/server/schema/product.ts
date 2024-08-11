import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, datetime, decimal } from 'drizzle-orm/mysql-core';
import { productGroupType } from './productGroupType';
import { laboratoryGroup } from './laboratory';
import { imagerieGroup } from './imagerie';
import { unit } from './unit';
import { parameter } from './parameter';
import { laboratoryRequest } from './laboratory';
import { fileOrPicture } from './fileOrPicture';
export const product = mysqlTable('product', {
	id: int('id').primaryKey().autoincrement(),
	products: text('products').notNull(),
	generic_name: text('generic_name'),
	group_type_id: int('group_type_id').references(() => productGroupType.id),
	laboratory_group_id: int('laboratory_group_id').references(() => laboratoryGroup.id),
	imagerie_group_id: int('imagerie_group_id').references(() => imagerieGroup.id),
	price: decimal('price', { precision: 10, scale: 2 }).notNull().$type<number>().default(0),
	unit_id: int('unit_id').references(() => unit.id),
	create_at: datetime('create_at', { mode: 'string' })
});
export const productRelations = relations(product, ({ one, many }) => ({
	unit: one(unit, {
		fields: [product.unit_id],
		references: [unit.id]
	}),
	productGroupType: one(productGroupType, {
		fields: [product.group_type_id],
		references: [productGroupType.id]
	}),
	laboratoryGroup: one(laboratoryGroup, {
		fields: [product.laboratory_group_id],
		references: [laboratoryGroup.id]
	}),
	imagerieGroup: one(imagerieGroup, {
		fields: [product.imagerie_group_id],
		references: [imagerieGroup.id]
	}),
	parameter: many(parameter),
	laboratoryRequest: many(laboratoryRequest),
	fileOrPicture: one(fileOrPicture)
}));
