import { datetime, float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { billing } from './billing';
import { relations } from 'drizzle-orm';

export const paymentType = mysqlTable('payment_type', {
	id: int('id').primaryKey().autoincrement(),
	by: varchar('by', { length: 255 })
});

export const payment = mysqlTable('payment', {
	id: int('id').primaryKey().autoincrement(),
	value: float('value').default(0),
	payment_type_id: int('payment_type_id').references(() => paymentType.id, {
		onDelete: 'restrict'
	}),
	billing_id: int('billing_id').references(() => billing.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	datetime: datetime('datetime', { mode: 'string' })
});

export const paymentRelations = relations(payment, ({ one }) => ({
	paymentType: one(paymentType, {
		fields: [payment.payment_type_id],
		references: [paymentType.id]
	}),
	billing: one(billing, {
		fields: [payment.billing_id],
		references: [billing.id]
	}),
}));
