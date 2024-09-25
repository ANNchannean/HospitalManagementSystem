<script lang="ts">
	import { copyPrescription } from '$lib/store/copyPrescription';
	import type { TPrescription } from '$lib/type/index';
	export let data: TPrescription[] | [];
	function copy() {
		if ($copyPrescription?.length) $copyPrescription = [];
		if (!$copyPrescription?.length) $copyPrescription = data;
	}
</script>

<button on:click={copy} type="button" class="btn btn-warning btn-sm"
	>Copy <i class="fa-regular fa-copy"></i></button
>

