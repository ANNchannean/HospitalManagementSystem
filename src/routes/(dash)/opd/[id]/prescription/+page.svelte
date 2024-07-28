<script lang="ts">
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import CreatePresrciption from '$lib/components/createORupdate/CreatePresrciption.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	let prescription_id: number;
	let unit_id: number;
	let loading = false;
	$: ({ get_prescriptions, get_advice_teaching } = data);
	$: find_prescription = get_prescriptions.find((e) => e.id === prescription_id);
</script>

<CreatePresrciption {unit_id} {prescription_id} {data} {form} />
<DeleteModal action="?/delete_prescription" id={find_prescription?.id} />

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header fs-4">
				<div class="row">
					<div class="col">
						<span># Presrciption</span>
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-success"
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
												prescription_id = 0;
												prescription_id = item.id;
												unit_id = 0;
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
												prescription_id = 0;
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
<div class="card card-info">
	<div class="card-header fs-4">
		<span># Advice or Teaching</span>
	</div>
	<form
		data-bs-sveltekit-keepfocus
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		action="?/create_advice_teaching"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="form-group row">
				<div class="col-sm-12">
					<div class="input-group">
						<textarea
							value={get_advice_teaching?.description ?? ''}
							id="advice_teaching"
							name="advice_teaching"
							rows="5"
							class="form-control"
						/>
					</div>
				</div>
			</div>

			<div class="float-end py-4">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
