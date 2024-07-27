<script lang="ts">
	export let sm = false;
	export let icon_only = false;
	export let text_only = false;
	export let loading: boolean = false;
	export let name = 'Save';
	export let style = '';
</script>

<button
	disabled={loading}
	class:btn-sm={sm === true}
	type="submit"
	class={`btn btn-success ${style}`}
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
			{name}
		{/if}
		{#if !text_only}
			{#if loading}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				{name}
			{/if}
			{#if !loading}
				<i class="fa-regular fa-floppy-disk"></i> {name}
			{/if}
		{/if}
	{/if}
</button>
