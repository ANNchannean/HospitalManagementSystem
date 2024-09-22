import { relations } from 'drizzle-orm';
import { int, mysqlTable, boolean, text, varchar, datetime } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { product } from './product';
import { fileOrPicture } from './fileOrPicture';
import { parameter } from './parameter';

export const laboratoryGroup = mysqlTable('laboratory_group', {
	id: int('id').primaryKey().autoincrement(),
	laboratory_group: varchar('laboratory_group', { length: 255 }).notNull()
});
export const laboratoryGroupRelations = relations(laboratoryGroup, ({ many }) => ({
	product: many(product)
}));

export const laboratoryRequest = mysqlTable('laboratory_request', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id').references(() => product.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
	// created_at: datetime('created_at', { mode: 'string' }).notNull()
});

export const laboratory = mysqlTable('laboratory', {
	id: int('id').primaryKey().autoincrement(),
	doctor_comment: text('doctor_comment'),
	finish_datetime: datetime('finish_datetime', { mode: 'string' }),
	sample: varchar('sample', { length: 255 }),
	status: boolean('status').default(false),
	visit_id: int('visit_id').references(() => visit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const laboratoryRelations = relations(laboratory, ({ one, many }) => ({
	visit: one(visit, {
		fields: [laboratory.visit_id],
		references: [visit.id]
	}),
	fileOrPicture: many(fileOrPicture)
}));
export const laboratoryRequestRelations = relations(laboratoryRequest, ({ one, many }) => ({
	visit: one(visit, {
		fields: [laboratoryRequest.visit_id],
		references: [visit.id]
	}),
	product: one(product, {
		fields: [laboratoryRequest.product_id],
		references: [product.id]
	}),
	laboratoryResult: many(laboratoryResult)
}));

export const laboratoryResult = mysqlTable('laboratory_result', {
	id: int('id').primaryKey().autoincrement(),
	// created_at: datetime('created_at', { mode: 'string' }).notNull(),
	laboratory_request_id: int('laboratory_request_id').references(() => laboratoryRequest.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	parameter_id: int('parameter_id').references(() => parameter.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	result: varchar('result', { length: 255 })
});

export const laboratoryResultRelations = relations(laboratoryResult, ({ one }) => ({
	laboratoryRequest: one(laboratoryRequest, {
		fields: [laboratoryResult.laboratory_request_id],
		references: [laboratoryRequest.id]
	}),
	parameter: one(parameter, {
		fields: [laboratoryResult.parameter_id],
		references: [parameter.id]
	})
}));
