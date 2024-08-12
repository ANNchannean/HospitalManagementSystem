<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import type {
		PageServerData,
		ActionData
	} from '../../../routes/(dash)/opd/[id]/prescription/$types';
	import DeleteModal from '../etc/DeleteModal.svelte';
	import Select from '../etc/Select.svelte';
	import CreateDuration from './CreateDuration.svelte';
	import CreateUse from './CreateUse.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	export let prescription_id: number;
	export let unit_id: number;
	$: ({ get_products, get_prescriptions, get_units_as_medicine, get_uses, get_durations } = data);
	$: filter_product_medicine = get_products.filter((e) => e.unit_id === unit_id);
	$: find_prescription = get_prescriptions.find((e) => e.id === prescription_id);
	let loading = false;
</script>

<DeleteModal action="?/delete_prescription" id={find_prescription?.id} />
<CreateDuration {data} {form} />
<CreateUse {data} {form} />
<!-- @_List_Parameter -->
<div class="modal fade" id="create_prescription" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Presrciption</h4>
				<button
					on:click={() => (prescription_id = 0)}
					id="close_create_prescription"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<form
				action={find_prescription?.id ? '?/update_prescription' : '?/create_prescription'}
				use:enhance={() => {
					loading = true;
					return async ({ update, result }) => {
						await update();
						loading = false;
						if (result.type !== 'failure') {
							prescription_id = 0;
							unit_id = 0;
							document.getElementById('close_create_prescription')?.click();
						}
					};
				}}
				method="post"
				class="form-horizontal"
			>
				<div class="modal-body">
					<input value={find_prescription?.id || ''} type="hidden" name="prescription_id" />
					<div class="card-body pt-0">
						<div class="form-group row pb-3">
							<label for="familly_history" class="col col-form-label">Medcine Type</label>

							<div class="col-sm-9">
								<div class="input-group">
									<Select
										bind:value={unit_id}
										items={get_units_as_medicine.map((e) => ({ id: e.id, name: e.unit }))}
									/>
								</div>
							</div>
						</div>
						<div class="form-group row pb-3">
							<label for="product_id" class="col col-form-label">Medcine</label>
							<div class="col-sm-9">
								<div class="input-group">
									<Select
										name="product_id"
										value={find_prescription?.product_id}
										items={filter_product_medicine.map((e) => ({
											id: e.id,
											name: e.products
												.concat(' (')
												.concat(` ${e.generic_name ?? ''}`)
												.concat(')')
										}))}
									/>
								</div>
							</div>
						</div>

						<div class="form-group row pb-3">
							<label for="use_id" class="col col-form-label">Time</label>
							<div class="col-sm-9">
								<div class="row">
									<div class="col">
										<div class="input-group">
											<input
												value={find_prescription?.morning === 0
													? ''
													: (find_prescription?.morning ?? '')}
												placeholder="Morning"
												id="morning"
												name="morning"
												type="number"
												step="any"
												class="form-control"
											/>
										</div>
									</div>
									<div class="col">
										<div class="input-group">
											<input
												value={find_prescription?.noon === 0 ? '' : (find_prescription?.noon ?? '')}
												placeholder="Noon"
												id="noon"
												name="noon"
												step="any"
												type="number"
												class="form-control"
											/>
										</div>
									</div>
									<div class="col">
										<div class="input-group">
											<input
												value={find_prescription?.afternoon === 0
													? ''
													: (find_prescription?.afternoon ?? '')}
												placeholder="Afternoon"
												id="afternoon"
												name="afternoon"
												step="any"
												type="number"
												class="form-control"
											/>
										</div>
									</div>
									<div class="col">
										<div class="input-group">
											<input
												value={find_prescription?.evening === 0
													? ''
													: (find_prescription?.evening ?? '')}
												placeholder="Evening"
												id="evening"
												step="any"
												name="evening"
												type="number"
												class="form-control"
											/>
										</div>
									</div>
									<div class="col">
										<div class="input-group">
											<input
												value={find_prescription?.night === 0
													? ''
													: (find_prescription?.night ?? '')}
												placeholder="Night"
												id="night"
												step="any"
												name="night"
												type="number"
												class="form-control"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="form-group row pb-3">
							<label for="use" class="col col-form-label">Use</label>
							<div class="col-sm-9">
								<div class="input-group">
									<Select
										name="use"
										value={find_prescription?.use}
										items={get_uses.map((e) => ({ id: e.description, name: e.description }))}
									/>
									<!-- <select value={find_prescription?.use ?? ''} name="use" class="form-control">
												<option value="">Select</option>
												{#each get_uses as item}
													<option value={item.description}>{item.description}</option>
												{/each}
											</select> -->

									<a
										href={'#'}
										type="button"
										data-bs-toggle="modal"
										data-bs-target="#create_use"
										class=" btn btn-link ml-1"
										on:click={() => document.getElementById('close_create_prescription')?.click()}
										><i class="fas fa-share-square"></i>
									</a>
								</div>
							</div>
						</div>
						<div class="form-group row pb-3">
							<label for="duration" class="col col-form-label">Duration</label>
							<div class="col-sm-9">
								<div class="input-group">
									<Select
										name="duration"
										value={find_prescription?.duration ?? ''}
										items={get_durations.map((e) => ({ id: e.description, name: e.description }))}
									/>

									<a
										href={'#'}
										type="button"
										data-bs-toggle="modal"
										data-bs-target="#create_duration"
										class=" btn btn-link ml-1"
										on:click={() => document.getElementById('close_create_prescription')?.click()}
										><i class="fas fa-share-square"></i>
									</a>
								</div>
							</div>
						</div>
						<div class="form-group row pb-3">
							<label for="Amount" class="col col-form-label">Amount</label>
							<div class="col-sm-9">
								<div class="input-group">
									<input
										value={find_prescription?.amount ?? ''}
										id="Amount"
										name="amount"
										type="number"
										class="form-control"
									/>
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
</div>
