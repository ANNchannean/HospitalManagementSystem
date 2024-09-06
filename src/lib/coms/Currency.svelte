<script lang="ts">
	export let among: number;
	type Currency =
		| {
				id: number;
				symbol: string;
				from_symbol: string;
				to_symbol: string;
				rate_to: number;
				rate_from: number;
				dialy_rate: number;
		  }
		| undefined;
	export let get_currency: Currency;
	let conerting: string;
	$: {
		if (get_currency?.symbol === get_currency?.from_symbol) {
			conerting = Intl.NumberFormat('en-US')
				.format(Math.ceil(among * Number(get_currency?.rate_from)) / Number(get_currency?.rate_to))
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
