<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	export let action = '';
	export let slug = '';
	export let id: number | undefined = undefined;
	let loading = false;
</script>

<div class="modal fade" id="confirme_modal" data-bs-backdrop="static">
	<form
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
				if (result.type !== 'failure') document.getElementById('close_confirme_modal')?.click();
			};
		}}
		{action}
		class="modal-dialog modal-dialog-centered modal-sm"
	>
		<input value={id} type="hidden" name="id" />
		<input value={slug} type="hidden" name="slug" />
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title">{$t('common.confirm_yes')}</h3>
			</div>
			<div class="modal-footer justify-content-between">
				<button
					id="close_confirme_modal"
					type="button"
					class="btn btn-secondary"
					data-bs-dismiss="modal"
					><i class="fa-solid fa-rectangle-xmark"></i> {$t('common.no')}</button
				>
				<button type="submit" class="btn btn-danger">
					{#if loading}
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
					{:else}
					<i class="fa-solid fa-square-check"></i>
					{/if}
					{$t('common.yes')}</button
				>
			</div>
		</div>
	</form>
</div>
