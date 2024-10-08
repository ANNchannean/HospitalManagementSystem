import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import drizzle from 'eslint-plugin-drizzle';
/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],

	{
		files: ['**/*.ts'],
		plugins: {
			drizzle
		},
		rules: {
			'drizzle/enforce-delete-with-where': 'error',
			'drizzle/enforce-update-with-where': 'error'
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'svelte/no-unused-svelte-ignore': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'no-undef': 'off',
			'@typescript-eslint/ban-ts-comment': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'static/']
	}
];
