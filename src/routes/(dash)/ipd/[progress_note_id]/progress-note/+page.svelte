<script lang="ts">
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import CreateVisitIpd from '$lib/coms-cu/CreateVisitIPD.svelte';
	import type { PageServerData } from './$types';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import SaopNote from '$lib/coms-ipd/SaopNote.svelte';
	import ParaClinic from '$lib/coms-ipd/ParaClinic.svelte';
	import Treatment from '$lib/coms-ipd/Treatment.svelte';
	import CopyPrescription from '$lib/coms-ipd/CopyPrescription.svelte';
	import CheckOut from '$lib/coms-ipd/CheckOut.svelte';
	export let data: PageServerData;
	let visit_id: number;
	$: ({ get_progress_note, removeDuplicateDate, get_exams, get_currency, get_staffs } = data);
</script>

<DeleteModal id={visit_id} action="?/delete_visit_ipd" />
<CreateVisitIpd
	data={{
		get_progress_note: get_progress_note,
		get_staffs: get_staffs
	}}
/>
<div class="card-header">
	<div class="d-grid gap-2 d-md-flex justify-content-between">
		<button
			on:click={() => {}}
			type="button"
			class="btn btn-success"
			data-bs-toggle="modal"
			data-bs-target="#create_visit_ipd"
			><i class="fa-solid fa-square-plus"></i>
			New Progress note
		</button>
		<CheckOut class="btn btn-danger" data={{ get_progress_note: get_progress_note }}
			>Discharge</CheckOut
		>
	</div>
</div>
<br />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-body table-responsive p-0">
				{#each removeDuplicateDate || [] as { date_checkup, id }}
					{@const f_date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
						new Date(date_checkup ?? '')
					)}
					<table class="table table-bordered">
						<thead class="table-light table-active">
							<tr class="text-center">
								<td>
									<DateTimeFormat timeStyle={false} date={date_checkup} />
								</td>
								<td>Observation Medical or SAOP note</td>
								<td>Para-Clinic</td>
								<td>Treatment </td>
							</tr>
						</thead>
						<tbody>
							{#each get_progress_note?.visit || [] as item (item.id)}
								{@const find_old_visit = item}
								{@const s_date = new Intl.DateTimeFormat('en-GB', {
									dateStyle: 'short'
								}).format(new Date(item.date_checkup ?? ''))}
								{#if f_date === s_date}
									<tr>
										<td class="p-2" style="width:10%;vertical-align:top;">
											<button
												type="button"
												class="btn btn-light btn-sm w-100 mb-2"
												data-bs-toggle="modal"
												data-bs-target="#create-product"
											>
												<DateTimeFormat dateStyle={false} date={item.date_checkup} />
											</button>
											<a
												href="/opd/{item?.id}/subjective"
												class="btn btn-outline-info btn-sm w-100 mb-2"
												><i class="fa-solid fa-file-pen"></i> Edit
											</a>
											<button
												type="button"
												disabled={item.billing?.status !== 'checking'}
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
										<td style="width: 30%;vertical-align:top;">
											<SaopNote {find_old_visit} {get_exams} />
										</td>
										<td style="width: 30%;vertical-align:top;">
											<ParaClinic {find_old_visit} />
										</td>
										<td style="width: 30%;vertical-align:top;">
											<CopyPrescription
												class="btn btn-warning btn-sm  py-0 mb-2"
												data={item?.presrciption?.map((e) => ({
													amount: e.amount,
													duration: e.duration,
													product_id: e.product_id,
													use: e.use,
													afternoon: e.afternoon,
													evening: e.evening,
													morning: e.morning,
													night: e.night,
													noon: e.noon
												})) || []}
											/>
											{#if find_old_visit.presrciption.length}
												<a
													class="btn btn-primary btn-sm mb-2 float-end py-0"
													href="/opd/{item.id}/prescription"
													>Edit <i class="fa-solid fa-file-pen"></i></a
												>
											{/if}
											<fieldset disabled={item.billing?.status !== 'checking'}>
												<Treatment {get_currency} {find_old_visit} />
											</fieldset>
										</td>
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
