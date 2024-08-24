<script lang="ts">
	export let html = '';
	export let contenteditable = false;
</script>

{#if contenteditable}
	<div style="max-width:100%;" contenteditable="true" bind:innerHTML={html} />
{:else}
	<div style="max-width:100%;" contenteditable="false" bind:innerHTML={html} />
{/if}
<!-- <style>
	[contenteditable] {
		padding: 0.5em;
		border: 1px solid #eee;
		border-radius: 4px;
	}
</style> -->
