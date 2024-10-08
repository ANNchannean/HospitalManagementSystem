<script lang="ts">
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import { browser } from '$app/environment';
	import Select from '$lib/coms/Select.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	import { globalLoading } from '$lib/store';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	export let data: PageServerData;
	let service_id = 0;
	let loading = false;
	$: ({ get_product_as_service, get_visit, get_currency, charge_on_service } = data);
	$: find_service = get_visit?.service.find((e) => e.id === service_id);
	$: total_service = get_visit?.billing?.charge?.find((e) => e.charge_on === 'service')?.price || 0;
</script>

<DeleteModal action="?/delete_service" id={find_service?.id || find_service?.id} />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col fs-5">
						<span># Service</span>
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-success btn-sm"
							data-bs-toggle="modal"
							data-bs-target="#create_service_operation"
							><i class="fa-solid fa-square-plus"></i>
							Add Service
						</button>
					</div>
				</div>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table table-head-fixed table-hover text-nowrap table-valign-middle">
					<thead class="">
						<tr>
							<th style="width: 5%;">N</th>
							<th style="width: 50%;">Service Item</th>
							<th style="width: 15%;">Price</th>
							<th style="width: 15%;">Operative Protocol</th>
							<th style="width: 15%;"></th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_visit?.service || [] as item, index (item.id)}
							<tr>
								<td>{index + 1}</td>
								<td>{item.product?.products ?? ''}</td>
								<td>
									<fieldset disabled={get_visit?.billing?.status !== 'checking'}>
										<form
											data-sveltekit-keepfocus
											on:change={(e) => e.currentTarget.requestSubmit()}
											use:enhance={() => {
												$globalLoading = true;
												loading = true;
												return async ({ update, result }) => {
													await update({ reset: false });
													loading = false;
													$globalLoading = false;
												};
											}}
											action="?/set_price_service"
											method="post"
										>
											<CurrencyInput
												class="input-group input-group-sm"
												amount={charge_on_service?.productOrder.find(
													(e) => e.product_id === item.product_id
												)?.price}
												name="price"
												symbol={get_currency?.currency}
											/>
											<input type="hidden" name="product_id" value={item.product_id} />
										</form>
									</fieldset>
								</td>
								<td
									><button
										on:click={() => {
											service_id = 0;
											service_id = item.id;
										}}
										type="button"
										class="btn btn-primary btn-sm"
										data-bs-toggle="modal"
										data-bs-target="#create_protocol"
										><i class="fa-solid fa-square-plus"></i>
										Protocol
									</button></td
								>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												service_id = 0;
												service_id = item.id;
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

<!-- @_Modal OperationProtocol -->
<div class="modal fade" id="create_protocol" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			enctype="multipart/form-data"
			action="?/create_protocol"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						service_id = 0;
						document.getElementById('close_create_protocol')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Operation Protocol</h4>
				<button
					id="close_create_protocol"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class=" card-body pt-0">
					<div class="row pb-3">
						<div class="col-12">
							<div class="row mb-3">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="surgeon">Surgeon</label>
										<input
											value={find_service?.operationProtocol?.surgeon ?? ''}
											id="surgeon"
											class="form-control"
											type="text"
											name="surgeon"
										/>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label for="assistant_surgeon">Assistant Surgeon</label>
										<input
											value={find_service?.operationProtocol?.assistant_surgeon ?? ''}
											id="assistant_surgeon"
											class="form-control"
											type="text"
											name="assistant_surgeon"
										/>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="anesthetist">Anesthetist</label>
										<input
											value={find_service?.operationProtocol?.anesthetist ?? ''}
											id="anesthetist"
											class="form-control"
											type="text"
											name="anesthetist"
										/>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label for="assistant_anesthetist">Assistant Anesthetist</label>
										<input
											value={find_service?.operationProtocol?.assistant_anesthetist ?? ''}
											id="assistant_anesthetist"
											class="form-control"
											type="text"
											name="assistant_anesthetist"
										/>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="scrub_nurse">Scrub Nurse</label>
										<input
											value={find_service?.operationProtocol?.scrub_nurse ?? ''}
											id="scrub_nurse"
											class="form-control"
											type="text"
											name="scrub_nurse"
										/>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label for="cirulating_nurse_block">Circulation / Nurse block</label>
										<input
											value={find_service?.operationProtocol?.cirulating_nurse_block ?? ''}
											id="cirulating_nurse_block"
											class="form-control"
											type="text"
											name="cirulating_nurse_block"
										/>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label for="midwife">Midwife</label>
								<input
									value={find_service?.operationProtocol?.midwife ?? ''}
									id="midwife"
									class="form-control"
									type="text"
									name="midwife"
								/>
							</div>
						</div>
					</div>

					<hr />
					<div class="row">
						<div class="col-12">
							<div class="row mb-3">
								<div class="col-sm-4">
									<div class="form-group">
										<label for="date">Dates</label>
										<input
											value={find_service?.operationProtocol?.date ?? ''}
											id="date"
											class="form-control"
											type="date"
											name="date"
										/>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label for="start_time">Start Time</label>
										<input
											value={find_service?.operationProtocol?.start_time?.substring(0, 5) ?? ''}
											id="start_time"
											class="form-control"
											type="time"
											name="start_time"
										/>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label for="finish_time">Finish Time</label>
										<input
											value={find_service?.operationProtocol?.finish_time?.substring(0, 5) ?? ''}
											id="finish_time"
											class="form-control"
											type="time"
											name="finish_time"
										/>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-4">
									<div class="form-group">
										<label for="pre_diagnosis">Pre-Diagnosis</label>
										<input
											value={find_service?.operationProtocol?.pre_diagnosis ?? ''}
											id="pre_diagnosis"
											class="form-control"
											type="text"
											name="pre_diagnosis"
										/>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label for="post_diagnosis">Post Diagnosis</label>
										<input
											value={find_service?.operationProtocol?.post_diagnosis ?? ''}
											id="post_diagnosis"
											class="form-control"
											type="text"
											name="post_diagnosis"
										/>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label for="type_anesthesia">Type Anesthesia</label>
										<input
											value={find_service?.operationProtocol?.type_anesthesia ?? ''}
											id="type_anesthesia"
											class="form-control"
											type="text"
											name="type_anesthesia"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<div class="row">
						<div class="col-12 mb-3">
							<div class="form-group">
								<label for="opertive_technique">Opertive Technique</label>
								<TextEditor
									name="opertive_technique"
									height={200}
									setValue={find_service?.operationProtocol?.opertive_technique ?? ''}
								/>

								<!-- {#if form?.description}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12 mb-3">
							<div class="form-group">
								<label for="blood_less">Blood Less</label>
								<input
									value={find_service?.operationProtocol?.blood_less ?? ''}
									id="blood_less"
									class="form-control"
									type="text"
									name="blood_less"
								/>
							</div>
						</div>
						<div class="col-12 mb-3">
							<div class="form-group">
								<label for="notes">Notes</label>
								<TextEditor
									name="notes"
									height={200}
									setValue={find_service?.operationProtocol?.notes ?? ''}
								/>

								<!-- {#if form?.description}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if} -->
							</div>
						</div>
					</div>
				</div>
			</div>
			<input type="hidden" name="service_id" value={find_service?.id} />
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
<!-- @_Modal  Service -->
<div class="modal fade" id="create_service_operation" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<fieldset disabled={get_visit?.billing?.status !== 'checking'}>
			<form
				action="?/create_service_operation"
				method="post"
				use:enhance={() => {
					loading = true;
					return async ({ update, result }) => {
						await update();
						loading = false;
						if (result.type !== 'failure') {
							document.getElementById('close_create_service_operation')?.click();
						}
					};
				}}
				class="modal-content"
			>
				<div class="modal-header">
					<h4 class="modal-title">Service</h4>
					<button
						id="close_create_service_operation"
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
									<label for="product_id">Service Item</label>
									<Select
										name="product_id"
										items={get_product_as_service.map((e) => ({ id: e.id, name: e.products }))}
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
		</fieldset>
	</div>
</div>
<fieldset disabled={get_visit?.billing?.status !== 'checking'}>
	<form
		method="post"
		use:enhance={() => {
			loading = true;
			$globalLoading = true;
			return async ({ update }) => {
				await update({ invalidateAll: true, reset: false });
				loading = false;
				$globalLoading = false;
			};
		}}
		action="?/update_total_service"
		class="card-footer row p-2 bg-light sticky-bottom"
	>
		<div class="col text-end">
			<button type="button" class="btn btn-warning">Total Service</button>
		</div>
		<div class="col-auto">
			<CurrencyInput
				name="total_service"
				symbol={get_currency?.currency_symbol}
				amount={total_service}
			/>
		</div>
		<div class="col-auto">
			<SubmitButton {loading} />
		</div>
	</form>
</fieldset>
