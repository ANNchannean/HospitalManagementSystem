<script lang="ts">
	import type { TCurrency } from '$lib/helper';
	export let get_currency: TCurrency;
	export let value = 0;
	export let amount: number = 0;
	export let sm = false;
	export let name = '';
	$: {
		if (get_currency?.symbol === get_currency?.from_symbol) {
			const p = Number(value) / Number(get_currency?.dialy_rate);
			amount = Number(p);
		} else if (get_currency?.symbol === get_currency?.to_symbol) {
			amount = value;
		} else {
			amount = value;
		}
	}
</script>

<div class={sm ? 'input-group-sm input-group' : 'input-group'}>
	<span class="input-group-text">{get_currency?.symbol ?? ''} </span>
	<input type="hidden" value={amount} {name} />
	<input bind:value step="any" type="number" class="form-control" />
</div>
