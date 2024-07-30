<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { dobToAge } from '$lib/helper';
	import type { PageServerData } from '../../../routes/(dash)/laboratory/$types';
	import SubmitButton from '../etc/SubmitButton.svelte';
	import TextEditor from '../etc/TextEditor.svelte';
	export let visit_id: number;
	export let data: PageServerData;
	$: ({ get_visits, get_imagers } = data);
	$: find_visit = get_visits.find((e) => e.id === visit_id);
	let loading = false;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="create_laboratory_result" data-bs-backdrop="static" role="dialog">
	<div class="modal-dialog modal-dialog-scrollablel modal-xl">
		<form
			action="?/create_laboratory_result"
			enctype="multipart/form-data"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					loading = false;
					if (result.type !== 'failure') {
						visit_id = 0;
						document.getElementById('close_laboratory_result')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<input type="hidden" name="visit_id" value={find_visit?.id} />
			<div class="modal-header">
				<h4 class="modal-title">laboratory Result</h4>
				<button
					on:click={() => {
						goto('?');
					}}
					id="close_laboratory_result"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
				>
				</button>
			</div>
			<div class="card-body pt-0">
				<div class="modal-body">
					<div class="row">
						<div class="col-12 pb-2">
							<div class="card-body alert alert-success">
								<table class="table table-responsive">
									<thead class="fs-5">
										<tr class="">
											<td>#Patient</td>
											<td> : </td>
											<td
												>{find_visit?.patient?.name_khmer},{find_visit?.patient?.name_latin ??
													''}</td
											>
											<td>#Gender</td>
											<td> : </td>

											<td>{find_visit?.patient?.gender ?? ''}</td>
										</tr>
										<tr class="">
											<td>#Phone</td>
											<td> : </td>
											<td>{find_visit?.patient?.telephone ?? ''}</td>
											<td>#Age</td>
											<td> : </td>

											<td>
												{dobToAge({
													d: new Date(find_visit?.patient?.dob ?? '').getDate(),
													m: new Date(find_visit?.patient?.dob ?? '').getMonth() + 1,
													y: new Date(find_visit?.patient?.dob ?? '').getFullYear(),
													date: new Date(find_visit?.date_checkup ?? '')
												}).y} ឆ្នាំ ,
												{dobToAge({
													d: new Date(find_visit?.patient?.dob ?? '').getDate(),
													m: new Date(find_visit?.patient?.dob ?? '').getMonth() + 1,
													y: new Date(find_visit?.patient?.dob ?? '').getFullYear(),
													date: new Date(find_visit?.date_checkup ?? '')
												}).m} ខែ ,
												{dobToAge({
													d: new Date(find_visit?.patient?.dob ?? '').getDate(),
													m: new Date(find_visit?.patient?.dob ?? '').getMonth() + 1,
													y: new Date(find_visit?.patient?.dob ?? '').getFullYear(),
													date: new Date(find_visit?.date_checkup ?? '')
												}).d} ថ្ងៃ
											</td>
										</tr>

										<!-- <tr>
											<td>#Request Check</td>
											<td> : </td>

											<td
												>{find_visit?.product?.products ??
													''}</td
											>
										</tr> -->
									</thead>
								</table>
							</div>
						</div>
						{#each find_visit?.laboratoryRequest || [] as item}
							{@const patient_gener = find_visit?.patient?.gender}
							{@const parameters = item.product?.parameter.filter((e) => {
								return e.gender === 'Other' || e.gender === patient_gener;
							})}
							<div class="col-12 py-3">
								<div class="card">
									<div class="card-header fs-4">
										<span>#{item.product?.products ?? ''}</span>
									</div>
									<div class="card-body table-responsive p-0">
										<table class="table">
											<thead class="">
												<tr>
													<th style="width: 5%;">N</th>
													<th style="width: 40%;">Parameter </th>
													<th style="width: 20%;" class="text-center">Result</th>
													<th style="width: 15%;" class="text-center">Unit</th>
													<th style="width: 20%;" class="text-center">Range Normal</th>
												</tr>
											</thead>
											<tbody>
												{#each parameters || [] as iitem, index}
													{@const plan_result = find_visit?.laboratoryRequest.flatMap(
														(e) => e.laboratoryResult
													)}
													<tr>
														<td>{index + 1}</td>
														<td class="text-wrap"
															>{iitem.parameter} <br />
															<span class="text-sm text-wrap">
																{@html browser ? iitem.description ?? '' : ''}
															</span>
														</td>
														<td>
															<input value={iitem.id} type="hidden" name="parameter_id" />
															<input
																type="hidden"
																name="laboratory_result_id"
																value={plan_result?.find((e) => e.parameter_id === iitem.id)?.id ??
																	''}
															/>
															<input
																type="hidden"
																name="laboratory_request_id"
																value={item?.id ?? ''}
															/>
															<input
																type="text"
																value={plan_result?.find((e) => e.parameter_id === iitem.id)
																	?.result ?? ''}
																class="form-control form-control-sm"
																list="browsers"
																name="laboratory_result"
																id="browser"
															/>
														</td>
														<td class="text-center"
															>{@html browser ? iitem.unit?.unit ?? '' : ''}</td
														>
														<td class="text-center">
															<span>
																{iitem.mini === 0 ? '' : iitem.mini?.toLocaleString('en-US')}</span
															>
															<span> {iitem.sign}</span>
															<span>
																{iitem.maxi === 0 ? '' : iitem.maxi?.toLocaleString('en-US')}</span
															>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						{/each}
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="doctor_comment">Comment</label>
								<TextEditor
									height={200}
									name="doctor_comment"
									id={find_visit?.laboratory?.id.toString()}
									getValue={find_visit?.laboratory?.doctor_comment ?? ''}
								/>

								<!-- {#if form?.template_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12 pb-3">
							<label for="exampleInputFile">Sample</label>
							<input
								value={find_visit?.laboratory?.sample ?? ''}
								type="text"
								name="sample"
								class="form-control"
							/>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="exampleInputFile">Picture</label>

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
						{#each get_imagers || [] as item}
							<form use:enhance method="post" action="?/delete_picture" class="p-2 col-3">
								<input type="hidden" name="laboratory_id" value={find_visit?.laboratory?.id} />
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
