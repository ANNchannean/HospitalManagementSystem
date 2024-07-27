import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { user } from './user';

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull()
});
