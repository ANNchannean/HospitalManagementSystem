<script lang="ts">
	import { enhance } from '$app/forms';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { dobToAge } from '$lib/helper';
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
				action="/ipd/checkout/?/check_out"
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
				<input value={get_progress_note?.id ?? ''} type="hidden" name="progress_note_id" />
				<input value={get_progress_note?.date_checkout ?? ''} type="hidden" name="date_checkout" />
				<input value={get_progress_note?.billing?.status} type="hidden" name="status" />
				<input value={get_progress_note?.inclund_pay} type="hidden" name="inclund_pay" />
				<div class="modal-header">
					<span class="fs-3">
						{$_('discharge_and_go_home')}
					</span>
				</div>
				<div class="modal-body">
					{#if get_progress_note?.service.length && get_progress_note.date_checkout === null}
						<ol class="list-group list-group-numbered">
							{#each get_progress_note?.service || [] as item}
								<li class="list-group-item">
									{item.product?.products}
									{#if item.is_paid_ipd}
										<span class="float-end btn btn-sm btn-warning rounded py-0">{$_('paid')}</span>
									{/if}
								</li>
							{/each}
						</ol>
						<ul class="list-group pt-2">
							{#if get_progress_note.presrciption.length}
								<li class="list-group-item">
									<input
										name="service"
										class="form-check-input me-1"
										type="checkbox"
										value="service"
										id="service"
									/>
									<label class="form-check-label stretched-link" for="service"
										>គិតប្រាក់សរុប រួមទាំងថ្លៃថ្នាំលេបនៅផ្ទះ</label
									>
								</li>
							{/if}
							<li class="list-group-item">
								<input
									class="form-check-input me-1"
									type="checkbox"
									value="treatment"
									id="treatment"
									name="treatment"
								/>
								<label class="form-check-label stretched-link" for="treatment"
									>គិតប្រាក់សរុប រួមទាំងថ្លៃព្យាបាល</label
								>
							</li>
						</ul>
					{/if}
					<div class="alert alert-primary py-1 mt-2">
						<span>{$_('date')}</span>
						<DateTimeFormat date={get_progress_note?.date_checkup} /> -
						<DateTimeFormat date={new Date().toJSON()} />
					</div>
					<div class="alert alert-danger py-1 mt-2">
						<span>{$_('day_stay')}</span>
						{dobToAge({ date: get_progress_note?.date_checkup, dob: new Date().toISOString() }).d}
						<span>{$_('day')}</span>
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
