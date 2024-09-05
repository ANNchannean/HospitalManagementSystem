import { writable } from 'svelte/store';
type Currency = {
	id: number;
	symbol: string;
	from_symbol: string;
	to_symbol: string;
	rate_to: number;
	rate_from: number;
	dialy_rate: number;
};
export const inerHight = writable('');
export const globalLoading = writable(false);
export const exchange_rate = writable(4000);

export const currency = writable<Currency | undefined>();
