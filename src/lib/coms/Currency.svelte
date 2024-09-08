<script lang="ts">
	export let amount: number | undefined;
	export let symbol: string | undefined;
	export let rate: number = 0;
	let conerting: string;
	$: {
		if (rate > 0) {
			conerting = new Intl.NumberFormat('en-US', { style: 'decimal' })
				.format(Number(amount) / rate)
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
