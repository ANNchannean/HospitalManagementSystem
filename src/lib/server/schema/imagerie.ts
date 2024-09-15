import { relations } from 'drizzle-orm';
import { int, mysqlTable, datetime, boolean, varchar, text } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { product } from './product';
import { fileOrPicture } from './fileOrPicture';

export const imagerieGroup = mysqlTable('imagerie_group', {
	id: int('id').primaryKey().autoincrement(),
	imagerie_group: varchar('imagerie_group', { length: 50 }).notNull()
});
export const imagerieGroupRelations = relations(imagerieGroup, ({ many }) => ({
	product: many(product)
}));

export const imagerieRequest = mysqlTable('imagerie_request', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id').references(() => product.id),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	result: text('text'),
	status: boolean('status').default(false),
	finish_datetime: datetime('finish_datetime', { mode: 'string' })
});

export const imagerieRequestRelations = relations(imagerieRequest, ({ one, many }) => ({
	visit: one(visit, {
		fields: [imagerieRequest.visit_id],
		references: [visit.id]
	}),
	product: one(product, {
		fields: [imagerieRequest.product_id],
		references: [product.id]
	}),
	fileOrPicture: many(fileOrPicture)
}));
