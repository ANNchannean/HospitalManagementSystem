<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SubmitButton from '$lib/coms//SubmitButton.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import type { PageServerData } from '../../routes/(dash)/laboratory/./$types';
	type Data = Pick<PageServerData, 'get_visits' | 'get_laboratory_group' | 'get_currency'>;
	export let data: Data;
	$: ({ get_visits, get_laboratory_group, get_currency } = data);
	$: find_visit = get_visits[0];
	let loading = false;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="update_laboratory_request" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Laboratory Request</h4>
				<button
					on:click={() => goto('?')}
					id="close_update_laboratory_request"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<fieldset disabled={find_visit?.billing?.status !== 'checking'}>
				<form
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							await update({ reset: false });
							loading = false;
							if (result.type !== 'failure') {
								document.getElementById('close_update_laboratory_request')?.click();
							}
						};
					}}
					action="?/update_laboratory_request"
					method="post"
				>
					<div class="modal-body">
						<input value={find_visit?.id} type="hidden" name="visit_id" />
						{#each get_laboratory_group as item (item.id)}
							<div class="card">
								<div class="card-header fs-5">
									<span>{item.laboratory_group}</span>
								</div>

								<div class="card-body">
									<div class="form-group row">
										{#each item.product as iitem (iitem.id)}
											<div class="col-sm-4 mb-3">
												<div class="form-check">
													<input
														name="product_id"
														class="form-check-input"
														type="checkbox"
														checked={find_visit?.laboratoryRequest.some(
															(e) => e.product_id === iitem.id
														)}
														id={iitem.id.toString()}
														value={iitem.id}
													/>
													<label for={iitem.id.toString()} class="custom-control-label"
														>{iitem.products}</label
													>
													<Currency symbol={get_currency?.currency_symbol} amount={iitem.price} />
												</div>
											</div>
										{/each}
									</div>
								</div>
							</div>
							<br />
						{/each}
					</div>
					<div class="modal-footer justify-content-end">
						<SubmitButton {loading} />
					</div>
				</form>
			</fieldset>
		</div>
	</div>
</div>
