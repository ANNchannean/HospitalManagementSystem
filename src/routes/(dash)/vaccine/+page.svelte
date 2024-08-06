<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	let vaccin_id: number;
	let loading = false;
	$: ({ get_injection } = data);
	const timesInject = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<!-- <DeleteModal action="?/delete_vaccine" /> -->

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
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">ID</th>
							<th class="text-center">Date</th>
							<th>Patient Name</th>
							<th class="text-center">Gender</th>
							<th class="text-center">Age</th>
							<th>Doctor</th>
							<th>Visit Type</th>
							<th>Vaccine</th>
							<th class="text-center">Schedule</th>

							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each get_injection as item}
							<tr>
								<td class="text-center">{item.id}</td>
								<td>
									{item?.patient?.name_khmer} <br />
									{item?.patient?.name_latin}
								</td>
								<td class="text-center">{item?.patient?.gender}</td>
								<td class="text-center">{item?.patient?.age}</td>
								<!-- <td>{item?.staff?.name}</td> -->
								<!-- <td>{item?.checkin_type}</td> -->
								<td>
									<div>
										<span class=" badge text-bg-info text-start"
											>{item.product?.products ?? ''}</span
										>
										<br />
									</div>
								</td>
								<td>
									<button
										data-bs-toggle="modal"
										data-bs-target="#create_injection"
										type="button"
										class="btn btn-sm btn-info"
										>Inject {item.vaccine.length}
									</button>
								</td>
								<td>
									<div>
										<button style="background-color: deeppink;" type="button" class="btn btn-sm"
											>Invoice
										</button>
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

<!-- @Create Ijection -->
<div class="modal fade" id="create_injection" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Create Document</h4>
				<button
					data-bs-toggle="modal"
					data-bs-target="#create_injection"
					id="nest_create_injection"
					type="button"
					class="d-none"
				>
				</button>
				<button
					id="close_create_injection"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<form
				class="modal-body"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update({ reset: false });
						loading = false;
					};
				}}
				action="?/create_injection"
				method="post"
			>
				<div class="card">
					<h5 class="card-header">Form Document</h5>
					<div class="card-body">
						<div class=" form-group row p-3">
							<div class="col">
								<div class="row">
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="1" />
										<label for="1" class="custom-control-label">លើកទី ០១​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="2" />
										<label for="2" class="custom-control-label">លើកទី ០២​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="3" />
										<label for="3" class="custom-control-label">លើកទី ០៣​</label>
									</div>
								</div>
							</div>
							<div class="col">
								<div class="row">
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="4" />
										<label for="4" class="custom-control-label">លើកទី ០៤​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="5" />
										<label for="5" class="custom-control-label">លើកទី ០៥​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="6" />
										<label for="6" class="custom-control-label">លើកទី ០៦​</label>
									</div>
								</div>
							</div>
							<div class="col">
								<div class="row">
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="7" />
										<label for="7" class="custom-control-label">លើកទី ០៧​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="8" />
										<label for="8" class="custom-control-label">លើកទី ០៨​</label>
									</div>
									<div class="mb-3 form-check">
										<input name="document_title" class="form-check-input" type="checkbox" id="9" />
										<label for="9" class="custom-control-label">លើកទី ០៩​</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<br />
				<div class="card-body table-responsive p-0">
					<table class="table text-nowrap">
						<tbody> </tbody>
					</table>
				</div>
				<br />
				<div class="modal-footer justify-content-end">
					<SubmitButton {loading} />
				</div>
			</form>
		</div>
	</div>
</div>
