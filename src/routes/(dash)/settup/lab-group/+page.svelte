<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let lab_group_id: number;
	let loading = false;
	$: ({ get_lab_groups } = data);
	$: find_lab_group = get_lab_groups.find((e) => e.id === lab_group_id);
</script>

<DeleteModal action="?/delete_lab_group" id={find_lab_group?.id} />
<!-- @_Add_Patient -->
<div class="modal fade" id="modal-add-medicine" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_lab_group?.id ? '?/update_lab_group' : '?/create_lab_group'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					lab_group_id = 0;
					if (result.type !== 'failure') document.getElementById('close')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Lab Group</h4>
				<button
					id="close"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_lab_group?.id} type="hidden" name="lab_group_id" />
								<label for="lab_group">Name</label>
								<input
									value={find_lab_group?.laboratory_group ?? ''}
									name="lab_group"
									type="text"
									class="form-control"
									id="lab_group"
								/>
								{#if form?.lab_group}
									<p class="text-danger">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2>Lab Group</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tools"></i>
					Settup
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/settup/lab-group" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-vials nav-icon"></i>
					Lboratory-group
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
					<div class="col-auto">
						<button
							on:click={() => (lab_group_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#modal-add-medicine"
							><i class="fa-solid fa-square-plus"></i>
							Add Lab Group
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-light table-active sticky-top">
						<tr>
							<th style="width: 5%;" class="text-center">N</th>
							<th>Lab Group</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="">
						{#each get_lab_groups as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.laboratory_group}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												lab_group_id = 0;
												lab_group_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#modal-add-medicine"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												lab_group_id = 0;
												lab_group_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
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
