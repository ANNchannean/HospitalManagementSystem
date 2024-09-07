<script lang="ts">
	export let among: number;
	export let rate = '';
	import type {TCurrency}  from '$lib/helper'
	export let get_currency: TCurrency;
	let conerting: string;
	$: exhange_rate = rate ? rate : get_currency?.dialy_rate;
	$: {
		if (get_currency?.symbol === get_currency?.from_symbol) {
			conerting = Intl.NumberFormat('en-US')
				.format(Math.ceil(among * Number(exhange_rate)) / Number(get_currency?.rate_to))
				.concat(` ${get_currency?.from_symbol}`);
		} else if (get_currency?.symbol === get_currency?.to_symbol) {
			conerting = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
				.format(among)
				.replace('$', '')
				.concat(` ${get_currency?.to_symbol}`);
		} else {
			conerting = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
				.format(among)
				.replace('$', '')
				.concat(` ${get_currency?.to_symbol}`);
		}
	}
	let className = 'btn btn-sm btn-warning py-0 ';
	export { className as class };
</script>

<span class={className}>
	{conerting}
</span>
