<script lang="ts">
	import { goto } from '$app/navigation';
	import CreateImgResult from '$lib/components/createORupdate/CreateImgResult.svelte';
	import { inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let imagerie_request_id: number;
	$: ({ get_imagerie_request } = data);
</script>

<CreateImgResult {data} {imagerie_request_id} />
<!-- @_Visite_Modal -->
<div class="modal fade" id="modal-visite">
	<div class="modal-dialog modal-dialog-centered modal-sm">
		<input
			id="close_visit_modal"
			class="hide"
			data-bs-dismiss="modal"
			aria-label="Close"
			type="hidden"
		/>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2 class="">Imagerie List</h2>
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
				<a href="/imagerie" class="btn btn-link p-0 text-secondary"
					><i class="nav-icon fas fa-image"></i>
					Imagerie
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
				</div>
			</div>

			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">ID Visit</th>
							<th class="text-center">Date</th>
							<th>Patient Name</th>
							<th class="text-center">Gender</th>
							<th class="text-center">Age</th>
							<th>Doctor</th>
							<th>Visit Type</th>
							<th>Request Check</th>
							<th></th>
							<th class="text-center">Result</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each get_imagerie_request as item}
							<tr>
								<td class="text-center">{item.visit?.id}</td>
								<td class="text-center"
									>{new Date(item.visit?.date_checkup ?? '')
										.toJSON()
										.slice(0, 10)
										.split('-')
										.reverse()
										.join('-')}
									<br />
									{new Date(item?.visit?.date_checkup ?? '').toLocaleTimeString('en-GB', {
										hour12: true,
										timeStyle: 'short'
									})}</td
								>
								<td>
									{item?.visit?.patient?.name_khmer} <br />
									{item?.visit?.patient?.name_latin}
								</td>
								<td class="text-center">{item?.visit?.patient?.gender}</td>
								<td class="text-center">{item?.visit?.patient?.age}</td>
								<td>{item?.visit?.staff?.name}</td>
								<td>{item?.visit?.checkin_type}</td>
								<td>
									<div>
										<span class=" badge text-bg-info text-start"
											>{item.product?.products ?? ''}</span
										>
										<br />
									</div>
								</td>
								<td>
									{#if item.status}
										<button class="btn btn-success btn-sm"
											><i class="fa-solid fa-check"></i> Done</button
										>
										<div class="btn-group">
											<button
												class="btn btn-secondary btn-sm dropdown-toggle"
												type="button"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											>
												View
											</button>
											<div class="dropdown-menu">
												<a class="dropdown-item" target="_blank" href="/report/{item.id}/imagerie"
													><i class="fa-regular fa-image"></i> Row</a
												>
												<a class="dropdown-item" target="_blank" href="/report/{item.id}/imagerie_1"
													><i class="fa-regular fa-file-image"></i> Col</a
												>
											</div>
										</div>
									{/if}
								</td>
								<td class="text-center">
									{#if item.status}
										<button
											type="button"
											on:click={() => {
												goto(`?imagerie_request_id=${item.id}`);
												imagerie_request_id = 0;
												imagerie_request_id = item.id;
											}}
											data-bs-toggle="modal"
											data-bs-target="#update_img_result"
											class="btn btn-warning btn-sm"
											>Edit
										</button>
									{:else}
										<button
											type="button"
											on:click={() => {
												goto(`?imagerie_request_id=${item.id}`);
												imagerie_request_id = 0;
												imagerie_request_id = item.id;
											}}
											data-bs-toggle="modal"
											data-bs-target="#update_img_result"
											class="btn btn-primary btn-sm"
											>Result
										</button>
									{/if}
								</td>
								<td>
									<div>
										<a
											style="background-color: deeppink;"
											href={'#'}
											type="button"
											class="btn btn-sm"
											>Invoice
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
