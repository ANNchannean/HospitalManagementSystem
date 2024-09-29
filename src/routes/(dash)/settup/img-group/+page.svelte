<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { _ } from 'svelte-i18n';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let imagerie_group_id: number;
	let loading = false;
	$: ({ get_imagerie_groups } = data);
	$: find_imagerie_group = get_imagerie_groups.find((e) => e.id === imagerie_group_id);
</script>

<DeleteModal action="?/delete_imagerie_group" id={find_imagerie_group?.id} />
<!-- @_Add_IMG Grop -->
<div class="modal fade" id="modal-add-imagerie-group" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_imagerie_group?.id ? '?/update_imagerie_group' : '?/create_imagerie_group'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					imagerie_group_id = 0;
					if (result.type !== 'failure') document.getElementById('close')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Imagerie Group</h4>
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
								<input value={find_imagerie_group?.id} type="hidden" name="imagerie_group_id" />
								<label for="imagerie_group">Name</label>
								<input
									value={find_imagerie_group?.imagerie_group ?? ''}
									name="imagerie_group"
									type="text"
									class="form-control"
									id="imagerie_group"
								/>
								{#if form?.imagerie_group}
									<p class="text-danger">{$_('input_data')}</p>
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
		<h2>Imagerie Group</h2>
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
				<a href="/settup/img-group" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-images nav-icon"></i>
					Imagerie
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
							on:click={() => (imagerie_group_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#modal-add-imagerie-group"
							><i class="fa-solid fa-square-plus"></i>
							New Imagerie Group
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Imagerie Group</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_imagerie_groups as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.imagerie_group}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												imagerie_group_id = 0;
												imagerie_group_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#modal-add-imagerie-group"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												imagerie_group_id = 0;
												imagerie_group_id = item.id;
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
