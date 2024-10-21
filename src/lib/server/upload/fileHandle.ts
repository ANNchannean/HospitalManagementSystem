import * as fs from 'fs/promises';
import { now_datetime_number } from '../utils';
import { generateId } from 'lucia';
import path from 'path';
const location = 'files';
import sharp from 'sharp';

export async function uploadFile(file: File) {
	if (file?.size) {
		try {
			const uid = generateId(10);
			const date_number = now_datetime_number().concat('-').concat(uid);
			const filePath = path.join(
				process.cwd(),
				location,
				`${date_number}.${(file as Blob).type.split('/')[1]}`
			);
			// await fs.writeFile(filePath, Buffer.from(await (file as Blob).arrayBuffer()));
			const buffer = await file.arrayBuffer();
			const data = await sharp(buffer)
				.resize(1000)
				.jpeg({ progressive: true, force: false, quality: 50 })
				.png({ progressive: true, force: false, quality: 50 })
				.toBuffer();
			await fs.writeFile(filePath, data);
			return `${date_number}.${(file as Blob).type.split('/')[1]}`;
		} catch (error) {
			console.log(error);
		}
	}
}
export async function updateFile(file: File, fileName: string) {
	if (file.size) {
		try {
			if (fileName) await deleteFile(fileName);
			const uid = generateId(10);
			const date_number = now_datetime_number().concat('-').concat(uid);
			const filePath = path.join(
				process.cwd(),
				location,
				`${date_number}.${(file as Blob).type.split('/')[1]}`
			);
			// await fs.writeFile(filePath, Buffer.from(await (file as Blob).arrayBuffer()));
			const buffer = await file.arrayBuffer();
			const data = await sharp(buffer)
				.resize(1000)
				.jpeg({ progressive: true, force: false, quality: 50 })
				.png({ progressive: true, force: false, quality: 50 })
				.toBuffer();
			await fs.writeFile(filePath, data);
			return `${date_number}.${(file as Blob).type.split('/')[1]}`;
		} catch (error) {
			console.log(error);
		}
	}
}
export async function deleteFile(fileName: string) {
	if (fileName) {
		try {
			await fs.unlink(`${location}/${fileName}`);
		} catch (error) {
			console.log(error);
		}
		return '';
	}
}

// const fileDelete = async (fileName: string) => {
// 	if (!fileName) return;
// 	try {
// 		await fs.unlink(`${location}/${fileName}`);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export async function getBuffer(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	return Buffer.from(arrayBuffer).toString('base64');
}
