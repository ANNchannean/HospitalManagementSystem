<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/progress-note/$types';
	type Data = Pick<PageServerData, 'get_progress_note'>;
	export let data: Data;
	$: ({ get_progress_note } = data);
	let loading = false;
	let className = 'btn btn-primary';
	export { className as class };
	$: id = 'myid'.concat(crypto.randomUUID().replaceAll('-', ''));
</script>

<button
	type="button"
	data-bs-toggle="modal"
	data-bs-target={'#'.concat(id?.toString() ?? '')}
	class={className}
>
	{#if get_progress_note?.date_checkout}
		checkout
	{:else}
		<slot />
	{/if}
</button>

<div class="modal fade" tabindex="-1" role="dialog" {id} data-bs-backdrop="static">
	<div class="modal-dialog modal-md" role="document">
		<div class="modal-content rounded-3 shadow">
			<form
				action="?/check_out"
				use:enhance={() => {
					loading = true;
					return async ({ update, result }) => {
						await update();
						loading = false;
						if (result.type !== 'failure') {
							document.getElementById('close_confirm_submit')?.click;
						}
					};
				}}
				method="post"
			>
				<input value={get_progress_note?.billing?.id} type="hidden" name="billing_id" />
				<div class="modal-body p-4 text-center">
					<h5 class="mb-0">{$t('common.confirm_yes')}</h5>
				</div>
				<div class="modal-footer flex-nowrap p-0">
					<button
						data-bs-dismiss="modal"
						disabled={loading}
						type="submit"
						class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0 border-end"
					>
						<strong>{$t('common.yes')}</strong>
					</button>

					<button
						id="close_confirm_submit"
						type="button"
						class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0"
						data-bs-dismiss="modal">{$t('common.no')}</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
