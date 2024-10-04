<script lang="ts">
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import CreatePresrciption from '$lib/coms-cu/CreatePresrciption.svelte';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import { copyPrescription } from '$lib/store/copyPrescription';
	import PastePrescription from '$lib/coms-ipd/PastePrescription.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	let prescription_id: number;
	let unit_id: number;
	let loading = false;
	$: ({ get_products, get_progress_note, get_units_as_medicine, get_uses, get_durations } = data);
	$: find_prescription = get_progress_note?.presrciption.find((e) => e.id === prescription_id);
	$: get_prescriptions = get_progress_note?.presrciption || [];
</script>

<CreatePresrciption
	bind:unit_id
	bind:prescription_id
	data={{
		get_products,
		get_prescriptions,
		get_units_as_medicine,
		get_uses,
		get_durations
	}}
	{form}
/>
<DeleteModal action="?/delete_prescription" id={find_prescription?.id} />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row g-1">
					<div class="col fs-5">
						<span># Presrciption</span>
					</div>
					<div class="col-auto">
						<PastePrescription action="?/paste_prescription" />
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-success btn-sm"
							data-bs-toggle="modal"
							data-bs-target="#create_prescription"
							><i class="fa-solid fa-square-plus"></i>
							Add Prescription
						</button>
					</div>
				</div>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table table-head-fixed table-hover text-nowrap table-valign-middle">
					<thead class="">
						<tr>
							<th>N</th>
							<th>Medcine</th>
							<th>Use</th>
							<th>Time</th>
							<th class="text-center">Duration</th>
							<th class="text-center">Amount</th>
							<th></th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_prescriptions as item, index}
							<tr>
								<td>{index + 1}</td>
								<td
									>{item.product?.products} <br />
									<span class="badge text-bg-primary">{item.product?.generic_name ?? ''}</span>
								</td>

								<td>
									{item.use ?? ''}
								</td>
								<td>
									<div>
										<span class="badge text-bg-warning">
											{#if item.morning !== 0}
												Morning {item.morning}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.noon !== 0}
												Noon {item.noon}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.afternoon !== 0}
												Afternoon {item.afternoon}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.evening !== 0}
												Evening {item.evening}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.night !== 0}
												Night {item.night}
											{/if}
										</span>
									</div>
								</td>
								<td class="text-center">{item.duration ?? ''}</td>
								<td class="text-center">{item.amount} {item.product?.unit?.unit} </td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												prescription_id = item.id;
												unit_id = item.product?.unit_id ?? 0;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create_prescription"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												prescription_id = item.id;
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
<br />
