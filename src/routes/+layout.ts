import { loading } from '$lib/translations';
// export const prerender = false;
// export const ssr = true;
import { browser } from '$app/environment';
import '$lib/i18n'; // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();
	await loading.toPromise();

	return {};
};
