<script lang="ts">
	import { enhance } from '$app/forms';
	export let used_at: string;
	export let value: string;
	export let prescription_id: number;
	$: used_at_ = '['.concat(used_at.toLowerCase()).concat(']');
</script>

<form class="col-auto mt-2" use:enhance action="?/active_prescription" method="post">
	<input type="hidden" value={prescription_id} name="prescription_id" />
	<input type="hidden" value={used_at_} name="used_at" />
	{#if value.includes(used_at_)}
		<button type="button" class="btn btn-sm btn-primary py-0">
			{used_at}
			<slot />
		</button>
	{:else}
		<button type="submit" class="btn btn-sm btn-warning py-0">
			{used_at}
			<slot />
		</button>
	{/if}
</form>
