import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { relations } from 'drizzle-orm';
import { product } from './product';
import { operationProtocol } from './operationProtocol';

export const service = mysqlTable('service', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	product_id: int('product_id').references(() => product.id, {
		onDelete: 'cascade'
	})
});
export const serviceRelations = relations(service, ({ one }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [service.visit_id]
	}),
	product: one(product, {
		references: [product.id],
		fields: [service.product_id]
	}),
	operationProtocol: one(operationProtocol)
}));
