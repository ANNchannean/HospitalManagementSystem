import { int, float, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { patient } from './patient';
import { relations } from 'drizzle-orm';
import { imagerieRequest } from './imagerie';
import { laboratory } from './laboratory';
import { clinicinfo } from './clinicInfo';
import { paymentType } from './payment';
import { billing } from './billing';
import { product } from './product';

export const fileOrPicture = mysqlTable('file_or_picture', {
	id: int('id').primaryKey().autoincrement(),
	filename: varchar('filename', { length: 255 }),
	mimeType: varchar('mimeType', { length: 255 }),
	lastModified: float('lastModified'),
	size: float('size'),
	patient_id: int('patient_id').references(() => patient.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	imagerie_request_id: int('imagerie_request_id').references(() => imagerieRequest.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	clinicinfo_id: int('clinicinfo_id').references(() => clinicinfo.id, { onDelete: 'cascade' }),
	laboratory_id: int('laboratory_id').references(() => laboratory.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	payment_type_id:int('payment_type_id').references(() => paymentType.id,{onDelete:'cascade',onUpdate:'cascade'} ),
	billing_id:int('billing_id').references(() => billing.id,{onDelete:'cascade',onUpdate:'cascade'} ),
	product_id:int('product_id').references(() => product.id,{onDelete:'cascade',onUpdate:'cascade'} ),
});

export const fileOrPictureRelations = relations(fileOrPicture, ({ one }) => ({
	clinicinfo: one(clinicinfo, {
		fields: [fileOrPicture.clinicinfo_id],
		references: [clinicinfo.id]
	}),
	patient: one(patient, {
		fields: [fileOrPicture.patient_id],
		references: [patient.id]
	}),
	imagerieRequest: one(imagerieRequest, {
		fields: [fileOrPicture.imagerie_request_id],
		references: [imagerieRequest.id]
	}),
	laboratory: one(laboratory, {
		fields: [fileOrPicture.laboratory_id],
		references: [laboratory.id]
	}),
	paymentType: one(paymentType, {
		fields: [fileOrPicture.payment_type_id],
		references: [paymentType.id]
	}),
	billing: one(billing, {
		fields: [fileOrPicture.billing_id],
		references: [billing.id]
	}),
	product: one(product, {
		fields: [fileOrPicture.product_id],
		references: [product.id]
	})
}));
