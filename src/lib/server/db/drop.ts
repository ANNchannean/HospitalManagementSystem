import { db } from '.';
import { sql } from 'drizzle-orm';
const main = async () => {
	console.log('Earasing');
	await db.execute(sql`DROP DATABASE hms`);
	console.log('Done');
	process.exit(0);
};

main();
