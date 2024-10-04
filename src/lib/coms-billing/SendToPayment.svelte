<script lang="ts">
	import { enhance } from '$app/forms';
	import { _ } from '$lib/translations';
	export let billing_id: number | undefined;
	export let status = 'active' as 'paid' | 'partial' | 'debt' | 'active' | 'process';
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
	{#if status === 'active'}
		<slot />
	{/if}
	{#if status === 'process'}
		<span>
			Process <i class="fa-solid fa-spinner fa-spin-pulse"></i>
		</span>
	{/if}
	{#if status !== 'active' && status !== 'process'}
		Paid
	{/if}
</button>

<div class="modal fade" tabindex="-1" role="dialog" {id} data-bs-backdrop="static">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content rounded-3 shadow">
			<form
				action="/patient/opd/?/process_billing"
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
				<input value={billing_id} type="hidden" name="id" />
				<div class="modal-body p-4 text-center">
					<h5 class="mb-0">{$_('confirm_yes')}</h5>
				</div>
				<div class="modal-footer flex-nowrap p-0">
					<button
						data-bs-dismiss="modal"
						disabled={loading}
						type="submit"
						class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0 border-end"
					>
						<strong>{$_('yes')}</strong>
					</button>

					<button
						id="close_confirm_submit"
						type="button"
						class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0"
						data-bs-dismiss="modal">{$_('no')}</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
