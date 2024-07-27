import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const commune = mysqlTable('commune', {
	id: int('commune_id').primaryKey().autoincrement(),
	name_khmer: varchar('name_khmer', { length: 255 }).notNull(),
	name_latin: varchar('name_latin', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	district_id: int('district_id').references(() => district.id)
});

// @_CommuneRelationship
export const communeRelations = relations(commune, ({ one, many }) => ({
	district: one(district, {
		fields: [commune.district_id],
		references: [district.id]
	}),
	village: many(village)
}));

// @_District
export const district = mysqlTable('district', {
	id: int('district_id').primaryKey().autoincrement(),
	name_khmer: varchar('name_khmer', { length: 255 }).notNull(),
	name_latin: varchar('name_latin', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	province_id: int('province_id').references(() => provice.id)
});

// @_DistrictRelationship
export const districtRelations = relations(district, ({ one, many }) => ({
	provice: one(provice, {
		fields: [district.province_id],
		references: [provice.id]
	}),
	commune: many(commune)
}));

// @_Provice
export const provice = mysqlTable('provice', {
	id: int('provice_id').primaryKey().autoincrement(),
	name_khmer: varchar('name_khmer', { length: 255 }).notNull(),
	name_latin: varchar('name_latin', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	contry_id: int('contry_id')
});

// @_ProvinceRelationship
export const provinceRelations = relations(provice, ({ one, many }) => ({
	district: many(district)
}));

// @_Village
export const village = mysqlTable('village', {
	id: int('village_id').primaryKey().autoincrement(),
	name_khmer: varchar('name_khmer', { length: 255 }).notNull(),
	name_latin: varchar('name_latin', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	commune_id: int('commune_id').references(() => commune.id)
});

// @_VillageRelationship
export const villageRelations = relations(village, ({ one }) => ({
	commune: one(commune, {
		fields: [village.commune_id],
		references: [commune.id]
	})
}));
