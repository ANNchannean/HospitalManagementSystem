<script lang="ts">
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import CreateVisitIpd from '$lib/components/createORupdate/CreateVisitIPD.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let visit_id: number;
	$: ({ get_progress_note, removeDuplicateDate } = data);
</script>

<DeleteModal id={visit_id} action="?/delete_visit_ipd" />
<CreateVisitIpd {data} />

<div class="card-header">
	<div class="row">
		<div class="col"></div>
		<div class="col-auto">
			<button
				on:click={() => {}}
				type="button"
				class="btn btn-success"
				data-bs-toggle="modal"
				data-bs-target="#create_visit_ipd"
				><i class="fa-solid fa-square-plus"></i>
				New Progress note
			</button>
			<button
				on:click={() => {}}
				type="button"
				class="btn btn-danger"
				data-bs-toggle="modal"
				data-bs-target="#create-product"
			>
				Discharge
			</button>
		</div>
	</div>
</div>
<br />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-body table-responsive p-0">
				{#each removeDuplicateDate || [] as { date_checkup }}
					{@const f_date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
						new Date(date_checkup ?? '')
					)}
					<table class="table table-bordered">
						<thead class="table-light table-active">
							<tr>
								<th class="text-center"
									>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
										new Date(date_checkup ?? '')
									)}</th
								>
								<th>Observation Medical or SAOP note</th>
								<th>Para-Clinic</th>
								<th>Treatment</th>
							</tr>
						</thead>
						<tbody>
							{#each get_progress_note?.visit || [] as item}
								{@const s_date = new Intl.DateTimeFormat('en-GB', {
									dateStyle: 'short'
								}).format(new Date(item.date_checkup ?? ''))}
								{#if f_date === s_date}
									<tr>
										<td class="p-2" style="width:9%;">
											<button
												type="button"
												class="btn btn-light btn-sm w-100 mb-2"
												data-bs-toggle="modal"
												data-bs-target="#create-product"
											>
												{new Intl.DateTimeFormat('en-GB', {
													timeStyle: 'short',
													hour12: true
												}).format(new Date(item?.date_checkup ?? ''))}
											</button>
											<a
												href="/opd/{item?.id}/subjective"
												class="btn btn-outline-info btn-sm w-100 mb-2"
												><i class="fa-solid fa-file-pen"></i> Edit
											</a>
											<button
												type="button"
												on:click={() => (visit_id = item.id)}
												class="btn btn-outline-danger btn-sm w-100 mb-2"
												data-bs-toggle="modal"
												data-bs-target="#delete_modal"
												><i class="fa-solid fa-trash-can"></i> Delete
											</button>
											<button
												type="button"
												class="btn btn-outline-success btn-sm w-100"
												data-bs-toggle="modal"
												data-bs-target="#"
												><i class="fa-solid fa-print"></i> Print
											</button>
										</td>
										<td>
											<div>
												<!-- <span>{JSON.stringify(item.subjective)}</span> -->
											</div>
										</td>
										<td>
											<!-- {JSON.stringify(item.imagerie)} -->
										</td>
										<td></td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</div>
	</div>
</div>
