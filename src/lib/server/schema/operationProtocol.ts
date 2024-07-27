import { relations } from 'drizzle-orm';
import { date, int, mysqlTable, text, time, varchar } from 'drizzle-orm/mysql-core';
import { service } from './service';

export const operationProtocol = mysqlTable('operation_protocol', {
	id: int('id').primaryKey().autoincrement(),
	surgeon: varchar('surgeon', { length: 256 }),
	assistant_surgeon: varchar('assistant_surgeon', { length: 256 }),
	anesthetist: varchar('anesthetist', { length: 256 }),
	assistant_anesthetist: varchar('assistant_anesthetist', { length: 256 }),
	scrub_nurse: varchar('scrub_nurse', { length: 256 }),
	cirulating_nurse_block: varchar('cirulating_nurse_block', { length: 256 }),
	midwife: varchar('midwife', { length: 256 }),
	pre_diagnosis: varchar('pre_diagnosis', { length: 256 }),
	post_diagnosis: varchar('post_diagnosis', { length: 256 }),
	type_anesthesia: varchar('type_anesthesia', { length: 256 }),
	opertive_technique: text('opertive_technique'),
	blood_less: varchar('blood_less', { length: 256 }),
	notes: text('notes'),
	date: date('date', { mode: 'string' }),
	start_time: time('start_time'),
	finish_time: time('finish_time'),
	service_id: int('service_id').references(() => service.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});

export const operationProtocolRelations = relations(operationProtocol, ({ one }) => ({
	service: one(service, {
		fields: [operationProtocol.service_id],
		references: [service.id]
	})
}));
