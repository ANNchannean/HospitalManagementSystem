<script lang="ts">
	import { enhance } from '$app/forms';
	import { _ } from 'svelte-i18n';
	export let action = '';
	export let slug = '';
	export let id: number | undefined = undefined;
	let loading = false;
	export let delete_modal = 'delete_modal';
</script>

<div class="modal fade" id={delete_modal} data-bs-backdrop="static">
	<form
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
				if (result.type !== 'failure') document.getElementById('close_delete_modal')?.click();
			};
		}}
		{action}
		class="modal-dialog modal-dialog-centered modal-sm"
	>
		<input value={id} type="hidden" name="id" />
		<input value={slug} type="hidden" name="slug" />
		<div class="modal-content">
			<div class="modal-body p-4 text-center">
				<h5 class="mb-0">{$_('confirm_delete')}</h5>
				<!-- <p class="mb-0">You can always change your mind in your account settings.</p> -->
			</div>
			<div class="modal-footer justify-content-between">
				<button
					id="close_delete_modal"
					type="button"
					class="btn btn-secondary"
					data-bs-dismiss="modal"
					><i class="fa-solid fa-rectangle-xmark"></i> {$_('no')}</button
				>
				<button type="submit" class="btn btn-danger">
					{#if loading}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
					{:else}
						<i class="fa-solid fa-trash-can"></i>
					{/if}
					{$_('yes')}</button
				>
			</div>
		</div>
	</form>
</div>
