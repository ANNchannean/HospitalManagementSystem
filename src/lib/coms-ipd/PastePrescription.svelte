<script lang="ts">
	import { enhance } from '$app/forms';
	import { copyPrescription } from '$lib/store/copyPrescription';
</script>

<form
	action="?/create_prescription"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
	method="post"
>
<input value="paste_prescription" type="hidden" name="paste_prescription" />
	{#each $copyPrescription as item (item.product_id)}
		<input value={item.product_id ?? ''} type="hidden" name="product_id" />
		<input value={item.use ?? ''} type="hidden" name="use" />
		<input value={item.amount ?? ''} type="hidden" name="amount" />
		<input value={item.duration ?? ''} type="hidden" name="duration" />
		<input value={item.morning ?? ''} type="hidden" name="morning" />
		<input value={item.noon ?? ''} type="hidden" name="noon" />
		<input value={item.afternoon ?? ''} type="hidden" name="afternoon" />
		<input value={item.evening ?? ''} type="hidden" name="evening" />
		<input value={item.night ?? ''} type="hidden" name="night" />
	{/each}
	<button class="btn btn-sm btn-primary" type="submit"><i class="fa-solid fa-paste"></i></button>
</form>
