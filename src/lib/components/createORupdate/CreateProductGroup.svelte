<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import type { ActionData, PageServerData } from '../../../routes/(dash)/product/$types';
	import SubmitButton from '../etc/SubmitButton.svelte';
	let product_group_id: number;
	export let data: PageServerData;
	$: ({ get_product_group_type } = data);
	$: find_product_group = get_product_group_type.find((e) => e.id === product_group_id);
	let loading = false;
</script>

<!-- @_Create Unit -->
<div class="modal fade" id="create_product_group" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">ProductGroup List</h4>
				<button
					on:click={() => (product_group_id = 0)}
					id="close_create_product_group"
					type="button"
					class="btn-close"
					data-bs-toggle="modal"
					data-bs-target="#create-product"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body pt-0">
				<form
					action={find_product_group?.id ? '?/update_product_group' : '?/create_product_group'}
					method="post"
					class="card-body"
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							await update();
							loading = false;
							if (result.type !== 'failure') {
								product_group_id = 0;
							}
						};
					}}
				>
					<input type="hidden" name="id" value={find_product_group?.id} />
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="product_group">ProductGroup</label>
								<input
									value={find_product_group?.group_type ?? ''}
									name="product_group"
									type="text"
									class="form-control"
									id="product_group"
								/>
								<!-- {#if form?.descriptionErr}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
					</div>

					<SubmitButton {loading} />
				</form>
				<br />
				<div>
					<table class="table text-nowrap table-bordered">
						<thead class="table-light table-active">
							<tr>
								<th>N</th>
								<th>ProductGroup</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each get_product_group_type as item, index}
								<tr>
									<td>{index + 1}</td>
									<td> {item.group_type ?? ''} </td>

									<td>
										<div>
											<a
												href={'#'}
												on:click={() => {
													product_group_id = 0;
													product_group_id = item.id;
												}}
												type="button"
												class="btn btn-success btn-sm"
												><i class="fa-solid fa-file-pen"></i>
											</a>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
