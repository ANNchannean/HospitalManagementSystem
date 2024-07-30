<script lang="ts">
	import CreateUnit from '$lib/components/createORupdate/CreateUnit.svelte';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { inerHight } from '$lib/store';
	import type { ActionData, PageServerData } from './$types';
	export let form: ActionData;
	export let data: PageServerData;
	let unit_id: number;
	$: ({ get_units } = data);
	$: find_unit = get_units.find((e) => e.id === unit_id);
</script>

<DeleteModal id={find_unit?.id} action="?/delete_unit" />
<CreateUnit {data} {form} {unit_id} />

<div class="row">
	<div class="col-sm-6">
		<h2>Unit</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a on:click={() => history.back()} href={'#'} class="btn btn-link text-secondary p-0"
					><i class="fas fa-undo"></i> Back</a
				>
			</li>
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
				<a href="/settup/unit" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-layer-group nav-icon"></i>
					Unit
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<!-- <h3 class="card-title">Fixed Header Table</h3> -->
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
							on:click={() => {
								unit_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_unit"
							><i class="fa-solid fa-square-plus"></i>
							New Unit
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Unit</th>
							<th>ProductGroupType</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_units as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td> {@html item.unit} </td>
								<td> {item.productGroupType?.group_type ?? 'None'} </td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												unit_id = 0;
												unit_id = item.id;
											}}
											data-bs-toggle="modal"
											data-bs-target="#create_unit"
											type="button"
											class="btn btn-primary btn-sm"
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
