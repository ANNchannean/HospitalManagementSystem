<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { browser } from '$app/environment';
	import Select from '$lib/components/etc/Select.svelte';
	export let data: PageServerData;
	let service_id = 0;
	let loading = false;
	$: ({ get_product_as_service, get_services } = data);
	$: find_service = get_services.find((e) => e.id === service_id);
	function destroy_summernote(id: string) {
		const jQuery = (window as any).$;
		jQuery(document).ready(function () {
			jQuery(`#${id}`).summernote('destroy');
		});
	}
	function create_summernote(id: string) {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				jQuery(`#${id}`).summernote({
					toolbar: [
						// [groupName, [list of button]]
						['fontstyle', ['fontname', 'fontsize']],
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['table']
						// ['insert',['picture']],
					],
					tabsize: 2,
					height: 200
				});
			});
		}
	}
</script>

<DeleteModal action="?/delete_service" id={find_service?.id || find_service?.id} />

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header fs-4">
				<div class="row">
					<div class="col">
						<span># Service</span>
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-success"
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
							<th>N</th>
							<th>Service Item</th>
							<th>Price</th>
							<th>Operative Protocol</th>
							<th></th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_services as item, index}
							<tr>
								<td>{index + 1}</td>
								<td>{item.product?.products ?? ''}</td>
								<td>{item.product?.price ?? ''}</td>
								<td
									><button
										on:click={() => {
											create_summernote('summernote');
											create_summernote('summernote1');
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
						destroy_summernote('summernote');
						destroy_summernote('summernote1');
						service_id = 0;
						document.getElementById('close_create_protocol')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Operation Protocol</h4>
				<button
					on:click={() => {
						destroy_summernote('summernote');
						destroy_summernote('summernote1');
					}}
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
								<textarea
									value={find_service?.operationProtocol?.opertive_technique ?? ''}
									id="summernote"
									name="opertive_technique"
									class="form-control"
								/>
								<!-- {#if form?.description}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
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
								<textarea
									value={find_service?.operationProtocol?.notes ?? ''}
									id="summernote1"
									name="notes"
									class="form-control"
								/>
								<!-- {#if form?.description}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
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
	</div>
</div>
