import type { Actions, PageServerLoad } from './$types';
import path from 'path';
import * as fs from 'fs/promises';
import { env } from '$env/dynamic/private';
import { now_datetime } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import child from 'child_process';
import util from 'util';
const exec = util.promisify(child.exec);
export const load: PageServerLoad = async () => {
	const filePath = path.join(process.cwd(), 'sql-backup');
	const file_list = (await fs.readdir(filePath)).reverse();
	return {
		file_list
	};
};

export const actions: Actions = {
	backup: async () => {
		const date = now_datetime();
		const name_backup = date.split(' ').join('_').split(':').join('.').concat('.sql');
		const filePath = path.join(process.cwd(), 'sql-backup');
		try {
			await exec(
				`mysqldump --user=${env.DB_USER} --password=${env.DB_PASSWORD} ${env.DB_NAME} > ${filePath}/${name_backup}`
			);
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: error });
		}
	},
	restore_from_dir: async ({ request }) => {
		const body = await request.formData();
		const file = body.get('sql') as File;
		const filePath = path.join(process.cwd(), 'files');
		if (file.size) {
			try {
				await exec(
					`mysql --user=${env.DB_USER} --password=${env.DB_PASSWORD} ${env.DB_NAME} < ${filePath}/${file.name}`
				);
			} catch (error) {
				console.log(error);
				return fail(500, { serverError: error });
			}

			await fs.unlink(`${filePath}/${file.name}`);
		}
	},
	restore: async ({ request }) => {
		const body = await request.formData();
		const { name_backup } = Object.fromEntries(body) as Record<string, string>;
		const filePath = path.join(process.cwd(), 'sql-backup');
		try {
			await exec(
				`mysql --user=${env.DB_USER} --password=${env.DB_PASSWORD} ${env.DB_NAME} < ${filePath}/${name_backup}`
			);
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: error });
		}
	},
	delete: async ({ request }) => {
		const body = await request.formData();
		const { slug } = Object.fromEntries(body) as Record<string, string>;
		const filePath = path.join(process.cwd(), 'sql-backup');
		try {
			await fs.unlink(`${filePath}/${slug ?? ''}`);
		} catch (error) {
			console.log(error);
			return fail(500, { serverError: error });
		}
	}
};
