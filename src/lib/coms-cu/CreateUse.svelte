<script lang="ts">
	import { enhance } from '$app/forms';
	import { _ } from '$lib/translations';
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/opd/[id]/prescription/$types';
	import Athtml from '$lib/coms/Athtml.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	type Data = Pick<PageServerData, 'get_uses'>;
	export let form: ActionData;
	let use_id: number;
	export let data: Data;
	$: ({ get_uses } = data);
	$: find_use = get_uses.find((e) => e.id === use_id);
	let loading = false;
</script>

<!-- @_Create Unit -->
<div class="modal fade" id="create_use" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Use List</h4>
				<button
					on:click={() => (use_id = 0)}
					id="close_create_use"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<form
					action={find_use?.id ? '?/update_use' : '?/create_use'}
					method="post"
					class="card-body pt-0"
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							await update();
							loading = false;
							if (result.type !== 'failure') {
								use_id = 0;
							}
						};
					}}
				>
					<input type="hidden" name="id" value={find_use?.id} />
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_use?.id} type="hidden" name="use_id" />
								<label for="description">Description</label>
								<input
									value={find_use?.description ?? ''}
									name="description"
									type="text"
									class="form-control"
									id="description"
								/>
								{#if form?.descriptionErr}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
							</div>
						</div>
					</div>

					<SubmitButton {loading} />
				</form>
				<br />
				<div>
					<table class="table text-nowrap">
						<thead class="table-light table-active">
							<tr>
								<th>N</th>
								<th>Use</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each get_uses as item, index}
								<tr>
									<td>{index + 1}</td>
									<td> <Athtml html={item.description ?? ''} /> </td>
									<td>
										<div>
											<a
												href={'#'}
												on:click={() => {
													use_id = 0;
													use_id = item.id;
												}}
												type="button"
												class="btn btn-light btn-sm"
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
