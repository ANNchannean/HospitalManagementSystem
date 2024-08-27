<script lang="ts">
	import { enhance } from '$app/forms';
	export let active_for: string;
	export let value: any[];
	export let prescription_id: number;
	$: datetime = value.find((e) => e.active_for === active_for)?.datetime ?? '';
</script>

<form class="col-auto mt-2" use:enhance action="?/active_prescription" method="post">
	<input type="hidden" value={prescription_id} name="prescription_id" />
	<input type="hidden" value={active_for} name="active_for" />
	{#if value.some((e) => e.active_for === active_for)}
		<button type="button" class="btn btn-sm btn-primary py-0">
			{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(
				new Date(datetime)
			)}
			{active_for}
			<slot />
		</button>
	{:else}
		<button type="submit" class="btn btn-sm btn-warning py-0">
			{active_for}
			<slot />
		</button>
	{/if}
</form>
