<script lang="ts">
	import Toast from '$lib/coms/Toast.svelte';
	import { copyPrescription } from '$lib/store/copyPrescription';
	import type { TPrescription } from '$lib/type/index';
	let show = false;
	export let data: TPrescription[] | [];
	function copy() {
		if ($copyPrescription?.length) $copyPrescription = [];
		if (!$copyPrescription?.length) $copyPrescription = data;
		show = true;
	}
	let className = 'btn btn-warning btn-sm';
	export { className as class };
</script>

<Toast bind:show message="ចម្លងបានជោគជ័យ!" />

{#if data.length}
	<button on:click={copy} type="button" class={className}
		>Copy <i class="fa-regular fa-copy"></i></button
	>
{/if}
