<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import CreateStaff from '$lib/components/createORupdate/CreateStaff.svelte';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let staff_id: number;
	$: ({ get_staffs } = data);
	$: find_staff = get_staffs.find((e) => e.id === staff_id);
</script>

<DeleteModal action="?/delete_staff" id={find_staff?.id} />
<CreateStaff {data} {form} {staff_id} />
<!-- @_Visite_Modal -->
<div class="modal fade" id="modal-visite">
	<div class="modal-dialog modal-dialog-centered modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<button type="submit" class="btn btn-success btn-lg p-4"
					><i class=" fas fa-stethoscope fa-3x"></i></button
				>
				<button type="submit" class="btn btn-danger btn-lg p-4"
					><i class=" fas fa-procedures fa-3x"></i></button
				>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2>Staff</h2>
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
				<a href="/staff" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-users nav-icon"></i>
					Staff
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
								staff_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_staff"
							><i class="fa-solid fa-square-plus"></i>
							New Staff
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">ID</th>
							<th>Name</th>
							<th>StaffType</th>
							<th>Gender</th>
							<th>Specific</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_staffs as item, index}
							<tr>
								<td class="text-center">{item.id ?? ''}</td>
								<td>{item.name ?? ''} </td>
								<td>{item.staff_type ?? ''} </td>
								<td>{item.gender ?? ''}</td>
								<td>{item.specific ?? ''}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												staff_id = 0;
												staff_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create_staff"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												staff_id = 0;
												staff_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												staff_id = 0;
												staff_id = item.id;
											}}
											type="button"
											class="btn btn-warning btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-key"></i>
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
