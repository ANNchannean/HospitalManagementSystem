<script lang="ts">
	import { enhance } from '$app/forms';
	import DateTimeFormat from './DateTimeFormat.svelte';
	export let active_for: string;
	export let value: any[];
	export let prescription_id: number;
	let loading = false;
</script>

<form
	class="col-auto mt-2"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}
	action="?/active_prescription"
	method="post"
>
	<input type="hidden" value={prescription_id} name="prescription_id" />
	<input type="hidden" value={active_for} name="active_for" />
	{#if value.some((e) => e.active_for === active_for)}
		<button type="button" class="btn btn-sm btn-primary py-0">
			{active_for}
			<slot />
		</button>
		<!-- <button formaction="?/remove" type="submit" class="btn btn-sm btn-primary py-0">-</button> -->
		<button type="button" class="btn btn-sm btn-info py-0">
			{value.filter((e) => e.active_for === active_for).length} time
		</button>
		<!-- <button formaction="?/add" type="submit" class="btn btn-sm btn-primary py-0">+</button> -->
		<DateTimeFormat dateStyle={false} date={value.pop().datetime} />
	{:else}
		<button type="submit" class="btn btn-sm btn-warning py-0">
			{active_for}
			<slot />
		</button>
	{/if}
</form>
