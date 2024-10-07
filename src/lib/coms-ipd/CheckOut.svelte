<script lang="ts">
	import { enhance } from '$app/forms';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { _ } from '$lib/translations';
	import type { LayoutServerData } from '../../routes/(dash)/ipd/[progress_note_id]/$types';
	type Data = Pick<LayoutServerData, 'get_progress_note'>;
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
	<div class="modal-dialog" role="document">
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
				<div class="modal-header">
					<span class="fs-3">
						{$_('discharge_and_go_home')}
					</span>
				</div>
				<div class="modal-body">
					<ol class="list-group list-group-numbered">
						{#each get_progress_note?.service || [] as item}
							<li class="list-group-item">
								{item.product?.products}
								<span class="float-end btn btn-sm btn-warning rounded py-0"
									>{get_progress_note?.billing?.status}</span
								>
							</li>
						{/each}
					</ol>
					<ul class="list-group pt-2">
						<li class="list-group-item">
							<input
								class="form-check-input me-1"
								type="checkbox"
								value=""
								id="firstCheckboxStretched"
							/>
							<label class="form-check-label stretched-link" for="firstCheckboxStretched"
								>គិតប្រាក់សរុប រូបទាំងថ្លៃថ្នាំលេបនៅផ្ទះ</label
							>
						</li>
						<li class="list-group-item">
							<input
								class="form-check-input me-1"
								type="checkbox"
								value=""
								id="secondCheckboxStretched"
							/>
							<label class="form-check-label stretched-link" for="secondCheckboxStretched"
								>គិតប្រាក់សរុប រូបទាំងថ្លៃព្យាបាល</label
							>
						</li>
					</ul>
					<div class="alert alert-primary py-1 mt-2">
						<span>{$_('date')}</span>
						<DateTimeFormat date={get_progress_note?.date_checkup} /> -
						<DateTimeFormat date={new Date().toJSON()} />
					</div>
					<div class="alert alert-danger py-1 mt-2">
						<span>{$_('date_checkout')}</span>
					</div>
				</div>

				<div class="modal-footer flex-nowrap p-0">
					<button
						id="close_confirm_submit"
						type="button"
						class=" btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
						data-bs-dismiss="modal">{$_('no')}</button
					>
					<button
						data-bs-dismiss="modal"
						disabled={loading}
						type="submit"
						class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0"
					>
						<strong>{$_('yes')}</strong>
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
