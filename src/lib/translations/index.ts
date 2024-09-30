import * as en from './locales/en.json';
import * as km from './locales/km.json';

const translations = {
	en: { ...en },
	km: { ...km }
};

import { derived, writable } from 'svelte/store';
type TT = keyof typeof translations.en | keyof typeof translations.km;
type LL = keyof typeof translations;
type EmptyObject = {
	[key: string]: never; // No keys allowed
};
export const locale = writable<LL>('en');
export const locales = Object.keys(translations);
function translate(locale: LL, key: TT, vars: EmptyObject) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	let text = translations[locale][key];
	if (!text) throw new Error(`no translation found for ${locale}.${key}`);
	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const _ = derived(
	locale,
	($locale) =>
		(key: TT, vars = {}) =>
			translate($locale, key, vars)
);
