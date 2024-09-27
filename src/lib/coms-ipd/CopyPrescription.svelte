<script lang="ts">
	import { copyPrescription } from '$lib/store/copyPrescription';
	import type { TPrescription } from '$lib/type/index';
	export let data: TPrescription[] | [];
	function copy() {
		if ($copyPrescription?.length) $copyPrescription = [];
		if (!$copyPrescription?.length) $copyPrescription = data;
	}
	let className = 'btn btn-warning btn-sm';
	export { className as class };
</script>

{#if data.length}
	<button
		class:text-primary={$copyPrescription === data}
		on:click={copy}
		type="button"
		class={className}
	>
		{#if $copyPrescription === data}
			បានចម្លង
			<i class="fa-solid fa-check"></i>
		{:else}
			ចម្លង
			<i class="fa-regular fa-copy"></i>
		{/if}
	</button>
{/if}
