import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connection } from './db';
async function main() {
	console.log('Running migrations');
	await migrate(db, { migrationsFolder: './drizzle' });
	console.log('Migrated successfully');

	await connection.end();
	process.exit(0);
}
main();
