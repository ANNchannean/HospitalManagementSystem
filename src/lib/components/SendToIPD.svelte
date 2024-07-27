<script lang="ts">
	import { enhance } from '$app/forms';
	export let action = '';
	export let id: number | undefined = undefined;
	let loading = false;
</script>

<div class="modal fade" id="send_to_ipd" data-bs-backdrop="static">
	<form
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
				if (result.type !== 'failure') document.getElementById('close_send_to_ipd')?.click();
			};
		}}
		{action}
		class="modal-dialog modal-dialog-centered modal-sm"
	>
		<input value={id} type="hidden" name="id" />
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title">Send To IPD ?</h3>
			</div>
			<div class="modal-footer justify-content-between">
				<button id="close_send_to_ipd" type="button" class="btn btn-default" data-bs-dismiss="modal"
					><i class="fa-solid fa-rectangle-xmark"></i> No</button
				>
				<button type="submit" class="btn btn-info">
					{#if loading}
						<i class="fa-solid fa-share fa-spin"></i>
					{:else}
						<i class="fa-solid fa-share"></i>
					{/if} Yes Send</button
				>
			</div>
		</div>
	</form>
</div>
