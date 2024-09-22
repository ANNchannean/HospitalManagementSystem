import { relations } from 'drizzle-orm';
import { boolean, datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { visit } from './visit';
import { product } from './product';
import { patient } from './patient';
import { unit } from './unit';

export const vaccine = mysqlTable('vaccine', {
	id: int('id').primaryKey().autoincrement(),
	visit_id: int('visit_id').references(() => visit.id, { onDelete: 'cascade' }),
	injection_id: int('injection_id').references(() => injection.id, { onDelete: 'cascade' }),
	product_id: int('product_id').references(() => product.id, { onDelete: 'set null' }),
	discription: varchar('discription', { length: 255 })
});

export const vaccineRelations = relations(vaccine, ({ one }) => ({
	visit: one(visit, {
		fields: [vaccine.visit_id],
		references: [visit.id]
	}),
	injection: one(injection, {
		fields: [vaccine.injection_id],
		references: [injection.id]
	}),
	product: one(product, {
		fields: [vaccine.product_id],
		references: [product.id]
	})
}));

export const injection = mysqlTable('injection', {
	id: int('id').primaryKey().autoincrement(),
	patient_id: int('patient_id').references(() => patient.id),
	datetime: datetime('datetime', { mode: 'string' }).notNull(),
	unit_id: int('unit_id').references(() => unit.id),
	discription: varchar('discription', { length: 255 })
});

export const injectionRelations = relations(injection, ({ many, one }) => ({
	appointmentInjection: many(appointmentInjection),
	vaccine: many(vaccine),
	patient: one(patient, {
		fields: [injection.patient_id],
		references: [patient.id]
	}),
	unit: one(unit, {
		fields: [injection.unit_id],
		references: [unit.id]
	})
}));

export const appointmentInjection = mysqlTable('appointment_injection', {
	id: int('id').primaryKey().autoincrement(),
	appointment: datetime('appointment', { mode: 'string' }).notNull(),
	datetime_inject: datetime('datetime_inject', { mode: 'string' }),
	status: boolean('status').default(false),
	discription: varchar('discription', { length: 255 }),
	times: int('times').notNull().default(1),
	injection_id: int('injection_id').references(() => injection.id, { onDelete: 'cascade' })
});

export const appointmentInjectionRelations = relations(appointmentInjection, ({ one }) => ({
	injection: one(injection, {
		fields: [appointmentInjection.injection_id],
		references: [injection.id]
	})
}));
