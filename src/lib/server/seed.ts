import { generateIdFromEntropySize } from 'lucia';
import { db } from './db';
import { user } from './schema';
// import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
// import { eq } from 'drizzle-orm';
async function main() {
	console.log('Seed start');
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
	console.log('Seed done');
	// const products = await db.query.product.findMany()
	// for(const e of products){
	// 	let price = (e.price * 4000) / 4000
	// 	await db.update(product).set({
	// 		price: Number(price.toFixed(2))
	// 	}).where(eq(product.id,e.id))
	// }

	process.exit(0);
}

main();
