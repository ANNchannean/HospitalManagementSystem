import {
	boolean,
	datetime,
	decimal,
	float,
	int,
	mysqlTable,
	text,
	varchar
} from 'drizzle-orm/mysql-core';
import { progressNote, visit } from './visit';
import { relations } from 'drizzle-orm';
import { product } from './product';
import { payment } from './payment';
import { fileOrPicture } from './fileOrPicture';
import { patient } from './patient';

export const billing = mysqlTable('billing', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	patient_id: int('patient_id').references(() => patient.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade'
	}),
	discount: varchar('discount', { length: 50 }).notNull().default('0'),
	sub_total: decimal('sub_total', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	total: decimal('total', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	total_after_tax: decimal('total_after_tax', { precision: 18, scale: 2 })
		.notNull()
		.$type<number>()
		.default(0),
	total_after_vat: decimal('total_after_vat', { precision: 18, scale: 2 })
		.notNull()
		.$type<number>()
		.default(0),
	paid: decimal('paid', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	tax: float('tax').default(0).notNull(),
	vat: float('vat').default(0).notNull(),
	balance: decimal('balance', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	return: decimal('return', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	status: varchar('status', { length: 10 })
		.$type<'paid' | 'partial' | 'debt' | 'checking' | 'paying'>()
		.default('checking')
		.notNull(),
	billing_type: varchar('billing_type', { length: 10 }).$type<'IPD' | 'OPD' | 'POS' | 'CHECKING'>(),
	created_at: datetime('created_at', { mode: 'string' }),
	hold: boolean('hold').default(false).notNull(),
	note: text('note')
});

export const charge = mysqlTable('charge', {
	id: int('id').primaryKey().autoincrement(),
	created_at: datetime('created_at', { mode: 'string' }),
	price: decimal('price', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	charge_on: varchar('charge_on', { length: 20 }).$type<
		'imagerie' | 'laboratory' | 'service' | 'prescription' | 'general' | 'vaccine' | 'bed'
	>(),
	billing_id: int('billing_id')
		.references(() => billing.id, { onDelete: 'cascade' })
		.notNull()
});

export const productOrder = mysqlTable('product_order', {
	id: int('id').primaryKey().autoincrement(),
	created_at: datetime('created_at', { mode: 'string' }),
	price: decimal('price', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	total: decimal('total', { precision: 18, scale: 2 }).notNull().$type<number>().default(0),
	qty: int('qty').default(1).notNull(),
	discount: varchar('discount', { length: 50 }).notNull().default('0'),
	product_id: int('product_id')
		.references(() => product.id)
		.notNull(),
	charge_id: int('charge_id')
		.references(() => charge.id, { onDelete: 'cascade' })
		.notNull()
});

export const productOrderRelations = relations(productOrder, ({ one }) => ({
	product: one(product, {
		references: [product.id],
		fields: [productOrder.product_id]
	}),
	charge: one(charge, {
		references: [charge.id],
		fields: [productOrder.charge_id]
	})
}));

export const chargeRelations = relations(charge, ({ one, many }) => ({
	billing: one(billing, {
		references: [billing.id],
		fields: [charge.billing_id]
	}),
	productOrder: many(productOrder)
}));

export const billingRelations = relations(billing, ({ one, many }) => ({
	visit: one(visit, {
		references: [visit.id],
		fields: [billing.visit_id]
	}),
	patient: one(patient, {
		references: [patient.id],
		fields: [billing.patient_id]
	}),
	progressNote: one(progressNote, {
		references: [progressNote.id],
		fields: [billing.progress_note_id]
	}),
	charge: many(charge),
	payment: many(payment),
	fileOrPicture: many(fileOrPicture)
}));

export const tax = mysqlTable('tax', {
	id: int('id').primaryKey().autoincrement(),
	created_at: datetime('created_at', { mode: 'string' }),
	value: float('value').default(0).notNull()
});
