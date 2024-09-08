<script lang="ts">
	export let amount: number | undefined;
	export let symbol: string | undefined;
	export let name = '';
	let className = 'input-group';
	export { className as class };
</script>

<div class={className}>
	<span class="input-group-text">{symbol ?? ''} </span>
	<input {name} bind:value={amount} step="any" type="number" class="form-control" />
</div>
