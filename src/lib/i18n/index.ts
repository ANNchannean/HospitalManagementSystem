import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'km';

register('en', () => import('./locales/en.json'));
register('km', () => import('./locales/km.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});