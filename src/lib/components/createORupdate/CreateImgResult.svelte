<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { dobToAge } from '$lib/helper';
	import { t } from '$lib/translations';
	import type { PageServerData } from '../../../routes/(dash)/imagerie/$types';
	import ImagePreview from '../ImagePreview.svelte';
	import Select from '../Select.svelte';
	import SubmitButton from '../SubmitButton.svelte';
	export let imagerie_request_id: number;
	export let data: PageServerData;
	$: ({ get_imagerie_templates, get_imagerie_request, get_imagers } = data);
	$: find_imagerie_request = get_imagerie_request.find((e) => e.id === imagerie_request_id);
	let loading = false;
	function destroy_summernote() {
		const jQuery = (window as any).$;
		jQuery(document).ready(function () {
			jQuery('#summernote').summernote('destroy');
		});
	}
	function create_summernote() {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				jQuery('#summernote').summernote({
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
					height: 400
				});
			});
		}
	}
	let imagerie_templage = '';
</script>

<div class="modal fade" id="update_img_result" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollablel modal-xl">
		<form
			enctype="multipart/form-data"
			action="?/update_img_result"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_update_img_result')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<input type="hidden" name="id" value={find_imagerie_request?.id || ''} />
			<div class="modal-header">
				<h4 class="modal-title">Imagerie Result</h4>
				<button
					on:click={() => {
						destroy_summernote();
						imagerie_request_id = 0;
						goto('?');
					}}
					id="close_update_img_result"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="card-body pt-0">
				<div class="modal-body">
					<div class="row">
						<div class="col-12 pb-2">
							<div class="card-body alert alert-info border p-0">
								<table class="table fs-5 table-borderless table-responsive">
									<thead class="text-bold">
										<tr class="">
											<td>#Patient</td>
											<td> : </td>
											<td
												>{find_imagerie_request?.visit?.patient?.name_khmer},{find_imagerie_request
													?.visit?.patient?.name_latin}</td
											>
											<td>#Gender</td>
											<td> : </td>

											<td>{find_imagerie_request?.visit?.patient?.gender ?? ''}</td>
										</tr>
										<tr class="">
											<td>#Phone</td>
											<td> : </td>
											<td>{find_imagerie_request?.visit?.patient?.telephone ?? ''}</td>
											<td>#Age</td>
											<td> : </td>

											<td>
												{dobToAge({
													d: new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
													m:
														new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
														1,
													y: new Date(
														find_imagerie_request?.visit?.patient?.dob ?? ''
													).getFullYear(),
													date: new Date(find_imagerie_request?.visit?.date_checkup ?? '')
												}).y} ឆ្នាំ ,
												{dobToAge({
													d: new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
													m:
														new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
														1,
													y: new Date(
														find_imagerie_request?.visit?.patient?.dob ?? ''
													).getFullYear(),
													date: new Date(find_imagerie_request?.visit?.date_checkup ?? '')
												}).m} ខែ ,
												{dobToAge({
													d: new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
													m:
														new Date(find_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
														1,
													y: new Date(
														find_imagerie_request?.visit?.patient?.dob ?? ''
													).getFullYear(),
													date: new Date(find_imagerie_request?.visit?.date_checkup ?? '')
												}).d} ថ្ងៃ
											</td>
										</tr>

										<tr>
											<td>#Request Check</td>
											<td> : </td>

											<td>{find_imagerie_request?.product?.products ?? ''}</td>
										</tr>
									</thead>
								</table>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="result">Template</label>
								<Select
									on:click={() => {
										destroy_summernote();
										create_summernote();
									}}
									bind:value={imagerie_templage}
									items={get_imagerie_templates.map((e) => ({ id: e.template, name: e.diagnosis }))}
								/>

								<!-- {#if form?.template_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="result">Result</label>
								<textarea
									class="form-control"
									value={imagerie_templage ? imagerie_templage : find_imagerie_request?.result}
									name="result"
									id="summernote"
								/>
								<!-- {#if form?.template_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="exampleInputFile">Picture</label>
								<div class="input-group">
									<input type="hidden" name="picture" />
									<input
										multiple
										type="file"
										name="file"
										accept="image/*"
										class="form-control"
										id="exampleInputFile"
									/>
								</div>
							</div>
						</div>
						{#each get_imagers || [] as item}
							<form use:enhance method="post" action="?/delete_picture" class="p-2 col-3">
								<input type="hidden" name="imagerie_request_id" value={find_imagerie_request?.id} />
								<input type="hidden" name="file_name" value={item.filename} />
								<img
									class="rounded mx-auto img-thumbnail d-block"
									src="/files/{item?.filename}"
									alt=""
									style="width: 100%; height: 100%;"
								/>
								<button class="btn btn-danger w-100">Delete</button>
							</form>
						{/each}
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
