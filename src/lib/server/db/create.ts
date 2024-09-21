import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../schema';
import 'dotenv/config';
export const connection = await mysql.createConnection({
	host: process.env.DB_HOST ?? '',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
});
await connection.connect();
const db = drizzle(connection, { mode: 'default', schema: schema });
const main = async () => {
	console.log('Creating');
	await db.execute(sql`CREATE DATABASE hms;`);
	console.log('Done');
	process.exit(0);
};

main();
