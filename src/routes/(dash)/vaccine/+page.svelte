<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	let vaccin_id: number;
	let loading = false;
	$: ({ get_vaccins, get_vaccin_types } = data);
	$: find_vaccin = get_vaccins.find((e) => e.id === vaccin_id);
</script>

<DeleteModal action="?/delete_vaccine" id={find_vaccin?.id} />
<!-- @_Add_Patient -->
<div class="modal fade" id="modal-add-Vaccine" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_vaccin?.id ? '?/update_vaccine' : '?/create_vaccine'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					vaccin_id = 0;
					if (result.type !== 'failure') document.getElementById('close-vaccine')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Vaccine</h4>
				<button
					id="close-vaccine"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_vaccin?.id} type="hidden" name="vaccine_id" />
								<label for="Discription">Discription</label>
								<input
									value={find_vaccin?.discription ?? ''}
									name="discription"
									type="text"
									class="form-control"
									id="Discription"
								/>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="vaccine_type_id">Vaccin Type</label>
								<select
									value={find_vaccin?.vaccine_type_id ?? ''}
									id="vaccine_type_id"
									class="form-control"
									name="vaccine_type_id"
								>
									{#each get_vaccin_types as item}
										<option value={item.id}>{item.type}</option>
									{/each}
								</select>
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
		<h2>List Vaccine</h2>
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
				<a href="/vaccine" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-syringe nav-icon"></i>
					Vaccine
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
							on:click={() => (vaccin_id = 0)}
							type="button"
							class="btn btn-success mx-2"
							data-bs-toggle="modal"
							data-bs-target="#modal-add-Vaccine"
							><i class="fa-solid fa-square-plus"></i>
							New Vaccine
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-head-fixed table-hover text-nowrap table-valign-middle">
					<thead class="">
						<tr>
							<th>N</th>
							<th>Discription</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_vaccins || [] as item, index}
							<tr>
								<td>{index + 1}</td>
								<td>{item.discription}</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												vaccin_id = 0;
												vaccin_id = item.id;
											}}
											type="button"
											class="btn btn-info btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#modal-add-Vaccine"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												vaccin_id = 0;
												vaccin_id = item.id;
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
