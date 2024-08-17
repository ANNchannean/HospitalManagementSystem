import { boolean, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { product } from './product';
import { relations } from 'drizzle-orm';
import { progressNote } from './visit';

export const ward = mysqlTable('ward', {
	id: int('id').primaryKey().autoincrement(),
	ward: varchar('ward', { length: 255 }),
	description: text('description')
});

export const room = mysqlTable('room', {
	id: int('id').primaryKey().autoincrement(),
	room: varchar('room', { length: 255 }),
	product_id: int('product_id').references(() => product.id),
	ward_id: int('ward_id').references(() => ward.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	status: boolean('status').notNull().default(false),
	description: text('description')
});

export const bed = mysqlTable('bed', {
	id: int('id').primaryKey().autoincrement(),
	bed: varchar('bed', { length: 255 }),
	room_id: int('room_id').references(() => room.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	ward_id: int('ward_id').references(() => ward.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	description: text('description')
});

export const wardRelations = relations(ward, ({ many }) => ({
	room: many(room),
	bed: many(bed)
}));
export const roomRelations = relations(room, ({ one, many }) => ({
	ward: one(ward, {
		references: [ward.id],
		fields: [room.ward_id]
	}),
	product: one(product, {
		references: [product.id],
		fields: [room.product_id]
	}),
	bed: many(bed),
	progressNote: many(progressNote)
}));

export const bedRelations = relations(bed, ({ one }) => ({
	room: one(room, {
		references: [room.id],
		fields: [bed.room_id]
	}),
	ward: one(ward, {
		references: [ward.id],
		fields: [bed.ward_id]
	})
}));
