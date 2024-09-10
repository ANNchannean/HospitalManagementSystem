<script lang="ts">
	import CreateLaboratoryResult from '$lib/coms-cu/CreateLaboratoryResult.svelte';
	import UpdateLaboratoryReq from '$lib/coms-cu/UpdateLaboratoryReq.svelte';
	import { inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	export let data: PageServerData;
	let visit_id: number;
	$: ({ get_visits, get_laboratory_group, get_currency } = data);
	$: find_visit = get_visits.filter((e) => e.id === visit_id);
</script>

<CreateLaboratoryResult data={{ get_visits: find_visit }} bind:visit_id />
<UpdateLaboratoryReq
	data={{
		get_laboratory_group,
		get_visits: find_visit,
		get_currency: get_currency
	}}
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
		<h2 class="">Laboratory List</h2>
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
				<a href="/laboratory" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-flask nav-icon"></i>
					Laboratory
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
				<table class="table table-bordered text-nowrap">
					<thead class="table-active table-light sticky-top">
						<tr class="text-center">
							<th class="text-center" style="width: 5%;">ID Visit</th>
							<th style="width: 10%;">Date</th>
							<th style="width: 10%;">Patient Name</th>
							<th style="width: 5%;">Gender</th>
							<th style="width: 5%;">Age</th>
							<th style="width: 10%;">Doctor</th>
							<th style="width: 5%;">Visit Type</th>
							<th style="width: 35%;">Request Check</th>
							<th style="width: 10%;">Result</th>
							<th style="width: 10%;"></th>
						</tr>
					</thead>
					<tbody>
						{#each get_visits as item}
							{@const laboratoryRequests = item.laboratoryRequest}
							{#if item.laboratoryRequest.length}
								<tr class="text-center">
									<td class="text-center">{item.id}</td>
									<td>
										<DateTimeFormat timeStyle={false} date={item?.date_checkup} />
										<br />
										<DateTimeFormat dateStyle={false} date={item?.date_checkup} />
									</td>

									<td>
										{item?.patient?.name_khmer} <br />
										{item?.patient?.name_latin}
									</td>
									<td>{item?.patient?.gender}</td>
									<td>{item?.patient?.age}</td>
									<td>{item?.staff?.name}</td>
									<td>{item?.checkin_type}</td>
									<td class="text-wrap text-start">
										{#each laboratoryRequests as iitem}
											<span class="m-1 badge text-bg-info">{iitem.product?.products}</span>
										{/each}
									</td>
									<td class="text-center">
										{#if item?.laboratory?.status === false}
											<button disabled type="button" class="btn btn-info btn-sm">View </button>
										{:else}
											<a
												target="_blank"
												href="/report/{item?.id}/laboratory"
												type="button"
												class="btn btn-info btn-sm"
												>View
											</a>
										{/if}
										{#if item?.laboratory?.status === false}
											<button
												on:click={() => {
													invalidateAll();
													visit_id = item.id;
												}}
												data-bs-toggle="modal"
												data-bs-target="#create_laboratory_result"
												type="button"
												class="btn btn-primary btn-sm"
												>More Fill
											</button>
										{:else}
											<button
												on:click={() => {
													invalidateAll();
													visit_id = item.id;
												}}
												data-bs-toggle="modal"
												data-bs-target="#create_laboratory_result"
												type="button"
												class="btn btn-warning btn-sm"
												>Fill
											</button>
										{/if}
									</td>
									<td>
										<div>
											<button
												type="button"
												on:click={() => {
													invalidateAll();
													visit_id = item.id;
												}}
												data-bs-toggle="modal"
												data-bs-target="#update_laboratory_request"
												class="btn btn-primary btn-sm"
												><i class="fa-solid fa-file-pen"></i>
											</button>
											<button style="background-color: deeppink;" type="button" class="btn btn-sm"
												>Invoice
											</button>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
