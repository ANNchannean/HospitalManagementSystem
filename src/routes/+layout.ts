/*
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
*/

import { setLocale } from '$lib/i18n/i18n-svelte';
import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
import { waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { loading } from '$lib/translations';

export const load: LayoutLoad = async (event) => {
	const locale = 'en';
	await loadLocaleAsync(locale);
	setLocale(locale);
	await waitLocale();
	await loading.toPromise();

	return event.data;
};
