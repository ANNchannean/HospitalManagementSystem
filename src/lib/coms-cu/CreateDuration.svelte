<script lang="ts">
	import { enhance } from '$app/forms';
	import Athtml from '$lib/coms/Athtml.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/opd/[id]/prescription/$types';
	type Data = Pick<PageServerData, 'get_durations'>;
	export let form: ActionData;
	let duration_id: number;
	export let data: Data;
	$: ({ get_durations } = data);
	$: find_duration = get_durations[0];
	let loading = false;
</script>

<!-- @_Create Unit -->
<div class="modal fade" id="create_duration" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Duration List</h4>
				<button
					on:click={() => (duration_id = 0)}
					id="close_create_duration"
					type="button"
					class="btn-close"
					data-bs-toggle="modal"
					data-bs-target="#create_prescription"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<form
					action={find_duration?.id ? '?/update_duration' : '?/create_duration'}
					method="post"
					class="card-body pt-0"
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							await update();
							loading = false;
							if (result.type !== 'failure') {
								duration_id = 0;
							}
						};
					}}
				>
					<input type="hidden" name="id" value={find_duration?.id} />
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_duration?.id} type="hidden" name="duration_id" />
								<label for="description">Description</label>
								<input
									value={find_duration?.description ?? ''}
									name="description"
									type="text"
									class="form-control"
									id="description"
								/>
								{#if form?.descriptionErr}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>

					<SubmitButton {loading} />
				</form>
				<br />
				<div style="height: 300px;  overflow-y: auto;">
					<table class="table text-nowrap">
						<thead class="table-light table-active">
							<tr>
								<th>N</th>
								<th>Duration</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each get_durations as item, index}
								<tr>
									<td>{index + 1}</td>
									<td> <Athtml html={item.description ?? ''} /> </td>

									<td>
										<div>
											<a
												href={'#'}
												on:click={() => {
													duration_id = 0;
													duration_id = item.id;
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
