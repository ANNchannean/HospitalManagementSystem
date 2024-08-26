<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	export let show = 'real';
	export let value = 0;
	export let break_line = false;
	export let exchange = 4000;
	export let plan_text = false;
</script>

{#if show === 'dorlar'}
	<span class:btn={plan_text ? '' : 'btn'} class=" btn-warning active btn-sm py-0"
		>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
			.format(value)
			.replace('$', '')}&nbsp;&#36;</span
	>
{:else if show === 'real'}
	<span class:btn={plan_text ? '' : 'btn'} class=" btn-danger active btn-sm py-0"
		>{new Intl.NumberFormat('en-US').format(value * exchange).replace('$', '')}&nbsp;&#x17DB;</span
	>
{:else}
	<span class:btn={plan_text ? '' : 'btn'} class=" btn-danger active btn-sm py-0"
		>{new Intl.NumberFormat('en-US').format(value * exchange).replace('$', '')}&nbsp;&#x17DB;</span
	>
	{#if break_line}
		<br />
	{/if}
	<span class:btn={plan_text ? '' : 'btn'} class=" btn-warning active btn-sm py-0"
		>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
			.format(value)
			.replace('$', '')}&nbsp;&#36;</span
	>
{/if}
