import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'mysql', // "mysql" | "sqlite" | "postgresql"
	schema: './src/lib/server/schema/index.ts',
	out: './drizzle',
	dbCredentials: {
		host: process.env.DB_HOST ?? '',
		user: process.env.DB_USER ?? '',
		password: process.env.DB_PASSWORD ?? '',
		database: process.env.DB_NAME ?? ''
	},
	strict: true,
	verbose: true
});
