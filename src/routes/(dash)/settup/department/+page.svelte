<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { _ } from '$lib/translations';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let department_id: number;
	let loading = false;
	$: ({ get_departments } = data);
	$: find_department = get_departments.find((e) => e.id === department_id);
</script>

<DeleteModal action="?/delete_department" id={find_department?.id} />
<!-- @_Add_Patient -->
<div class="modal fade" id="department">
	<div class="modal-dialog modal-xl">
		<form
			action={find_department?.id ? '?/update_department' : '?/create_department'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					department_id = 0;
					if (result.type !== 'failure') document.getElementById('department')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Department</h4>
				<button
					id="department"
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
							<div class="form-group">
								<input value={find_department?.id} type="hidden" name="department_id" />
								<label for="department">Name</label>
								<input
									value={find_department?.department ?? ''}
									name="department_"
									type="text"
									class="form-control"
									id="department"
								/>
								{#if form?.department_}
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
		<h2>Department</h2>
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
				<a href="/settup/department" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-building nav-icon"></i>
					Department
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
							on:click={() => (department_id = 0.1)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#department"
							><i class="fa-solid fa-square-plus"></i>
							New Department
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-light table-active sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Department</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_departments as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item?.department}</td>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												department_id = 0;
												department_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#department"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												department_id = 0;
												department_id = item.id;
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
