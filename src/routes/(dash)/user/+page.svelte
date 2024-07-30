<script lang="ts">
	import type { PageServerData } from './$types';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { inerHight } from '$lib/store';
	import CreateUser from '$lib/components/createORupdate/CreateUser.svelte';
	export let data: PageServerData;

	let user_id: string;
	$: ({ get_users } = data);
	$: find_user = get_users.find((e) => e.id === user_id);
</script>

<CreateUser {data} {user_id} />
<DeleteModal action="?/delete_user" slug={find_user?.id} />
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
		<h2>User</h2>
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
				<a href="/user" class="btn btn-link p-0 text-secondary">
					<i class="fa-solid fa-user-lock"></i>
					User
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
								user_id = '';
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_user"
							><i class="fa-solid fa-square-plus"></i>
							New User
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-head-fixed table-hover text-nowrap table-valign-middle">
					<thead class="">
						<tr>
							<th>ID</th>
							<th>Username</th>
							<th>Role</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_users as item}
							<tr>
								<td>{item.id ?? ''}</td>
								<td>{item.username ?? ''} </td>
								<td>{item.role ?? ''} </td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												user_id = '';
												user_id = item.id;
											}}
											type="button"
											class="btn btn-info btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create_user"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												user_id = '';
												user_id = item.id;
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
												user_id = '';
												user_id = item.id;
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
