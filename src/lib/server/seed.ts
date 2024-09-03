/*
import { generateIdFromEntropySize } from 'lucia';
import { db } from './db';
import { inventory, user } from './schema';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
async function main() {
	console.log('Processing...');

	const userId = generateIdFromEntropySize(10);
	const password = 'aaaa1111';
	const passwordHash = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	await db.insert(user).values({
		id: userId,
		image: '',
		role: 'ADMIN',
		password_hash: passwordHash,
		username: 'doctor'
	});
	const products = await db.query.product.findMany();
	for (const e of products) {
		await db.insert(inventory).values({
			product_id: e.id
		});
	}
	

	console.log('Done');
	process.exit(0);
}

main();
*/