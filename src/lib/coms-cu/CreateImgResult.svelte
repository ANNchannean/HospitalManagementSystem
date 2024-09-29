<script lang="ts">
	import { enhance } from '$app/forms';
	import Select from '$lib/coms/Select.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	import { dobToAge } from '$lib/helper';
	import type { PageServerData } from '../../routes/(dash)/imagerie/$types';
	type Data = Pick<PageServerData, 'get_imagerie_templates' | 'get_imagerie_request'>;
	export let imagerie_request_id: number;
	export let data: Data;
	$: ({ get_imagerie_templates, get_imagerie_request } = data);
	$: find_imagerie_request = get_imagerie_request[0];
	let loading = false;
	let imagerie_templage = '';
	$: age_p_visit = dobToAge({
		dob: find_imagerie_request?.visit?.patient.dob ?? '',
		date: find_imagerie_request?.visit?.date_checkup ?? ''
	});
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
						imagerie_request_id = 0;
						imagerie_templage = '';
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
							<div class="card-body alert alert-light border p-0">
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
												អាយុ {age_p_visit?.y} ឆ្នាំ ,
												{age_p_visit?.m} ខែ ,
												{age_p_visit?.d} ថ្ងៃ
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
									bind:value={imagerie_templage}
									items={get_imagerie_templates.map((e) => ({ id: e.template, name: e.diagnosis }))}
								/>

								<!-- {#if form?.template_}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="result">Result</label>
								<TextEditor
									name="result"
									setValue={imagerie_templage
										? imagerie_templage
										: (find_imagerie_request?.result ?? '')}
								/>

								<!-- {#if form?.template_}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
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
						{#each find_imagerie_request?.fileOrPicture || [] as item}
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
