<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import CreateMedicineType from '$lib/components/createORupdate/CreateMedicineType.svelte';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	$: ({ get_unit_as_medicine } = data);
	let unit_id: number;
	$: find_unit = get_unit_as_medicine.find((e) => e.id === unit_id);
</script>

<DeleteModal action="?/delete_medicine_type" id={find_unit?.id} />
<CreateMedicineType {form} {data} {unit_id} />

<div class="row">
	<div class="col-sm-6">
		<h2 class="">Medicine Type</h2>
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
				<a href="/medicine/type" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-capsules nav-icon"></i>
					Medicine Type
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
							on:click={() => (unit_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-medicine-type"
							><i class="fa-solid fa-square-plus"></i>
							New Medicine Type
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Medicine Type</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_unit_as_medicine || [] as item, index}
							<tr>
								<td class=" text-center">{index + 1}</td>
								<td>{item.unit}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												unit_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-medicine-type"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												unit_id = 0;
												unit_id = item.id;
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
