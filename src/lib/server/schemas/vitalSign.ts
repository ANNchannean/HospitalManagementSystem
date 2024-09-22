import { relations } from 'drizzle-orm';
import { float, mysqlTable, text, int, datetime, varchar } from 'drizzle-orm/mysql-core';
import { progressNote, visit } from './visit';
import { staff } from './staff';

export const vitalSign = mysqlTable('vital_sign', {
	id: int('id').primaryKey().autoincrement(),
	dbp: float('dbp'),
	sbp: float('sbp'),
	pulse: float('pulse'),
	t: float('t'),
	sp02: float('sp02'),
	height: float('height'),
	weight: float('weight'),
	rr: float('rr'),
	bmi: float('bmi'),
	visit_id: int('visit_id').references(() => visit.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	// form IPD
	datetime: datetime('datetime', { mode: 'string' }),
	stool: varchar('stool', { length: 255 }),
	urine: varchar('urine', { length: 255 }),
	note: text('note'),
	piv: int('piv'),
	drink: int('drink'),
	nasogastric_tube_in: int('nasogastric_tube_in'),
	nasogastric_tube_out: int('nasogastric_tube_out'),
	fluid_out: int('fluid_out'),
	vomiting: int('vomiting'),
	by: int('by').references(() => staff.id, { onDelete: 'set null' }),
	progress_note_id: int('progress_note_id').references(() => progressNote.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});
export const vitalSignRelations = relations(vitalSign, ({ one }) => ({
	visit: one(visit),
	staff: one(staff, {
		fields: [vitalSign.by],
		references: [staff.id]
	}),
	progressNote: one(progressNote, {
		fields: [vitalSign.progress_note_id],
		references: [progressNote.id]
	})
}));
