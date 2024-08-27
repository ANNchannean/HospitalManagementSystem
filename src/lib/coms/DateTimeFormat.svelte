<script lang="ts">
	export let date: string | null | undefined;
	export let timeStyle: boolean = true;
	export let dateStyle: boolean = true;
</script>

{#if date?.length}
	{#if dateStyle}
		{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
			.format(new Date(date))
			.replaceAll('/', '-')}
	{/if}
	{#if timeStyle}
		{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true })
			.format(new Date(date))
			.replaceAll('/', '-')}
	{/if}
{/if}
