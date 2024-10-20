<script lang="ts">
	import { _ } from '$lib/translations';
	export let sm = false;
	export let icon_only = false;
	export let text_only = false;
	export let loading: boolean = false;
	export let name = '';
	export let style = '';
</script>

<button
	disabled={loading}
	class:btn-sm={sm === true}
	type="submit"
	class={`btn btn-success d-print-none ${style}`}
>
	{#if icon_only}
		{#if loading}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
		{/if}
		{#if !loading}
			<i class="fa-regular fa-floppy-disk"></i>
		{/if}
	{/if}
	{#if !icon_only}
		{#if text_only}
			{name ? name : $_('save')}
		{/if}
		{#if !text_only}
			{#if loading}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				{name ? name : $_('save')}
			{/if}
			{#if !loading}
				<i class="fa-regular fa-floppy-disk"></i> {name ? name : $_('save')}
			{/if}
		{/if}
	{/if}
</button>
