<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import { inerHight } from '$lib/store';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	let vaccin_dose_id: number;
	let loading = false;
	$: ({ get_vaccine_dose } = data);
	$: find_vaccine_dose = get_vaccine_dose.find((e) => e.id === vaccin_dose_id);
</script>

<DeleteModal action="?/delete_vaccine_dose" id={find_vaccine_dose?.id} />
<!-- @_List_Parameter -->
<div class="modal fade" id="create_dose" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			enctype="multipart/form-data"
			action={find_vaccine_dose?.id ? '?/update_vaccine_dose' : '?/create_vaccine_dose'}
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						vaccin_dose_id = 0;
						document.getElementById('close_vaccine_dose')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<div class="modal-header">
				<h4 class="modal-title">Create Dose</h4>
				<button
					id="close_vaccine_dose"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="card-body pt-0">
				<div class="modal-body">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_vaccine_dose?.id} type="hidden" name="id" />

								<TextEditor name="description" id="dose" />
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
					Vaccine Dose
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
							on:click={() => (vaccin_dose_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_dose"
							><i class="fa-solid fa-square-plus"></i>
							New Dose
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Dose</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_vaccine_dose as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{@html item.discription}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												vaccin_dose_id = 0;
												vaccin_dose_id = item.id;
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
												vaccin_dose_id = 0;
												vaccin_dose_id = item.id;
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
