import type { Load } from '@sveltejs/kit';
import { loading } from '$lib/translations';
// export const prerender = false;
// export const ssr = true;
export const load: Load = async () => {
	await loading.toPromise();

	return {};
};
