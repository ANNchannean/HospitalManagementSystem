<script lang="ts">
	export let amount: number | undefined;
	export let symbol: string | undefined;
	export let rate: number = 0;
	export let rate_to: number = 0;
	let conerting: string;
	$: total = (Number(amount) * rate_to) / rate || 0;
	$: {
		if (rate > 0) {
			conerting = new Intl.NumberFormat('en-US', { style: 'decimal' })
				.format(total)
				.concat(' ' + symbol ?? '');
		} else {
			conerting = new Intl.NumberFormat('en-US', { style: 'decimal' })
				.format(amount || 0)
				.concat(' ' + symbol ?? '');
		}
	}

	let className = 'btn btn-sm btn-warning py-0 ';
	export { className as class };
</script>

<span class={className}>
	{conerting}
</span>
