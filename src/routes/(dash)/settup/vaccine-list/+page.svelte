<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import { inerHight } from '$lib/store';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	export let data: PageServerData;
	let unit_id: number;
	let loading = false;
	$: ({ get_unit_as_vaccine } = data);
	$: find_unit_as_vaccine = get_unit_as_vaccine.find((e) => e.id === unit_id);
</script>

<!-- <DeleteModal action="?/delete_vaccine_type" id={find_vaccin_types?.id} /> -->
<div class="modal fade" id="create_dose" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			enctype="multipart/form-data"
			action="?/update_vaccine_dose"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						unit_id = 0;
						document.getElementById('close_vaccine_dose')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<div class="modal-header">
				<h4 class="modal-title">Dose</h4>
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
								<input value={find_unit_as_vaccine?.id} type="hidden" name="unit_id" />

								<TextEditor
									setValue={find_unit_as_vaccine?.vaccine_dose ?? ''}
									name="description"
									id="dose"
								/>
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
		<h2>Vaccine dose</h2>
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
					Vaccine dose
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
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Unit</th>
							<th>Dose</th>
						</tr>
					</thead>
					<tbody>
						{#each get_unit_as_vaccine as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.unit}</td>

								<td>
									<button
										on:click={() => {
											unit_id = 0;
											unit_id = item.id;
										}}
										type="button"
										class="btn btn-success btn-sm"
										data-bs-toggle="modal"
										data-bs-target="#create_dose"
										>Dose
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
