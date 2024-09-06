<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CreateImgResult from '$lib/coms-cu/CreateImgResult.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let imagerie_request_id: number;
	$: ({ get_imagerie_request, get_imagerie_templates } = data);
	$: find_imagerie_request = get_imagerie_request?.filter((e) => e.id === imagerie_request_id);
</script>

<CreateImgResult
	data={{
		get_imagerie_request: find_imagerie_request,
		get_imagerie_templates: get_imagerie_templates
	}}
	bind:imagerie_request_id
/>
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
						<tr class="text-center">
							<th style="width: 5%;">ID Visit</th>
							<th style="width: 10%;">Date</th>
							<th style="width: 10%;">Patient Name</th>
							<th style="width: 5%;">Gender</th>
							<th style="width: 5%;">Age</th>
							<th style="width: 10%;">Doctor</th>
							<th style="width: 10%;">Visit Type</th>
							<th style="width: 20%;">Request Check</th>
							<td style="width: 10%;"></td>
							<th style="width: 10%;">Result</th>
							<th style="width: 10%;"></th>
						</tr>
					</thead>
					<tbody>
						{#each get_imagerie_request as item}
							<tr class="text-center">
								<td class="text-center">{item.visit?.id}</td>
								<td class="text-center">
									<DateTimeFormat timeStyle={false} date={item.visit?.date_checkup} />
									<br />
									<DateTimeFormat dateStyle={false} date={item.visit?.date_checkup} />
								</td>
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
										<!-- <button class="btn btn-success btn-sm mb-2"
											><i class="fa-solid fa-check"></i> Done</button
										>
										<br /> -->
										<a
											class="btn btn-light btn-sm"
											target="_blank"
											href="/report/{item.id}/imagerie?row=true"
											><i class="fa-regular fa-image"></i> View
										</a>
										<a
											class="btn btn-light btn-sm"
											target="_blank"
											href="/report/{item.id}/imagerie?row=false"
											><i class="fa-regular fa-file-image"></i> View
										</a>
									{/if}
								</td>
								<td class="text-center">
									{#if item.status}
										<button
											type="button"
											on:click={() => {
												invalidateAll();
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
												invalidateAll();
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
