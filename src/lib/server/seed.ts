import { db } from './db';
import { product, user } from './schema';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
async function main() {
	// console.log('Seed start');
	// const userId = generateIdFromEntropySize(10);
	// let password = 'l';
	// const passwordHash = await hash(password, {
	// 	// recommended minimum parameters
	// 	memoryCost: 19456,
	// 	timeCost: 2,
	// 	outputLen: 32,
	// 	parallelism: 1
	// });
	// await db.insert(user).values({
	// 	id: userId,
	// 	image: '',
	// 	role: 'ADMIN',
	// 	password_hash: passwordHash,
	// 	username: 'ADMIN'
	// });
	// console.log('Seed done');
	process.exit(0);
}

main();
