<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let vaccin_type_id: number;
	let loading = false;
	$: ({ get_vaccin_types } = data);
	$: find_vaccin_types = get_vaccin_types.find((e) => e.id === vaccin_type_id);
</script>

<DeleteModal action="?/delete_vaccine_type" id={find_vaccin_types?.id} />
<!-- @_Add_Patient -->
<div class="modal fade" id="modal-add-Vaccine" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_vaccin_types?.id ? '?/update_vaccine_type' : '?/create_vaccine_type'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					vaccin_type_id = 0;
					if (result.type !== 'failure') document.getElementById('close')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Vaccine</h4>
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
								<input value={find_vaccin_types?.id} type="hidden" name="vaccine_type_id" />
								<label for="type">Type</label>
								<input
									value={find_vaccin_types?.type ?? ''}
									name="type"
									type="text"
									class="form-control"
									id="type"
								/>
								{#if form?.type}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
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
		<h2>List Vaccine Type</h2>
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
				<a href="/settup/vaccine-type" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-viruses nav-icon"></i>
					Vaccine Type
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
							on:click={() => (vaccin_type_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#modal-add-Vaccine"
							><i class="fa-solid fa-square-plus"></i>
							New Vaccine Type
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Type</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_vaccin_types as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.type}</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												vaccin_type_id = 0;
												vaccin_type_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#modal-add-Vaccine"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												vaccin_type_id = 0;
												vaccin_type_id = item.id;
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
