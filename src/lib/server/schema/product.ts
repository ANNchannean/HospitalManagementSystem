import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, datetime, decimal, boolean, varchar } from 'drizzle-orm/mysql-core';
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
	barcode: varchar('barcode', { length: 255 }),
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
	fileOrPicture: one(fileOrPicture),
	inventory: many(inventory)
}));

export const inventory = mysqlTable('inventory', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id')
		.references(() => product.id)
		.notNull(),
	original_price: decimal('original_price', { precision: 10, scale: 2 })
		.notNull()
		.$type<number>()
		.default(0),
	exchange: int('exchange').default(4000).notNull(),
	expier_date: datetime('expier_date', { mode: 'string' }),
	outstock: boolean('outstock').default(false).notNull(),
	stock: int('stock').default(0).notNull(),
	count_stock: boolean('count_stock').default(false).notNull()
});

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
	product: one(product, {
		fields: [inventory.product_id],
		references: [product.id]
	}),
	subUnit: many(subUnit)
}));

export const subUnit = mysqlTable('sub_unit', {
	id: int('id').primaryKey().autoincrement(),
	per_item: int('per_item').notNull().default(0),
	pcs: int('pcs').notNull().default(0),
	price: decimal('price', { precision: 10, scale: 2 }).notNull().$type<number>().default(0),
	inventory_id: int('inventory_id')
		.references(() => inventory.id)
		.notNull(),
	unit_id: int('unit_id')
		.references(() => unit.id)
		.notNull()
});

export const subUnitRelations = relations(subUnit, ({ one }) => ({
	inventory: one(inventory, {
		fields: [subUnit.inventory_id],
		references: [inventory.id]
	}),
	unit: one(unit, {
		fields: [subUnit.unit_id],
		references: [unit.id]
	})
}));
