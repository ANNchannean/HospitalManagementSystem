<script lang="ts">
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/settup/parameter/[id]/$types';

	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import Select from '$lib/coms/Select.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	export let parameter_id: number;
	let loading = false;
	$: ({ get_units, get_parameters } = data);
	$: find_parameter = get_parameters.find((e) => e.id === parameter_id);
</script>

<!-- @_Add_Parameter -->
<div class="modal fade" id="update_parameter" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		
		<form
			enctype="multipart/form-data"
			action="?/update_parameter"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						parameter_id = 0;
						document.getElementById('close_update_parameter')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Paramater</h4>
				<button
					id="close_update_parameter"
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
							<div class="form-group pb-3">
								<input type="hidden" name="parameter_id" value={find_parameter?.id} />
								<label for="parameter">Parameter</label>
								<input
									value={find_parameter?.parameter}
									name="parameter_"
									type="text"
									class="form-control"
									id="parameter"
								/>
								{#if form?.parameter_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="description">Description</label>
								<TextEditor
									id={find_parameter?.id.toString()}
									name="description"
									setValue={find_parameter?.description ?? ''}
								/>

								{#if form?.description}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="row">
								<div class="col-6">
									<div class="form-group pb-3">
										<label for="unit">Unit</label>
										<div class="input-group">
											<Select
												value={find_parameter?.unit_id}
												height="200"
												name="unit_id"
												items={get_units.map((e) => ({ id: e.id, name: e.unit }))}
											/>
											<a
												href="/settup/unit"
												type="button"
												class=" btn btn-default ml-1"
												on:click={() => document.getElementById('close_update_parameter')?.click()}
												><i class="fas fa-share-square"></i>
											</a>
										</div>

										{#if form?.unit_id}
											<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
										{/if}
									</div>
								</div>
								<div class="col-6">
									<div class="form-group pb-3">
										<label for="gender">Gender</label>
										<select
											value={find_parameter?.gender}
											name="gender"
											class="form-control"
											id="gender"
										>
											<option value="Other">None</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
										</select>
										{#if form?.gender}
											<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
										{/if}
									</div>
								</div>
							</div>
						</div>
						<div class="col-12">
							<div class="row">
								<div class="col-5">
									<div class="form-group pb-3">
										<label for="mini">Mini</label>
										<input
											value={find_parameter?.mini === 0 ? '' : find_parameter?.mini}
											name="mini"
											type="number"
											step="0.01"
											class="form-control"
											id="mini"
										/>
										{#if form?.mini}
											<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
										{/if}
									</div>
								</div>
								<div class="col-2">
									<div class="form-group text-center">
										<label for="sign">Sign</label>
										<select
											value={find_parameter?.sign ?? ''}
											class="form-control"
											name="sign"
											id="sign"
										>
											<option value=""></option>
											<option value="-">{'-'}</option>
											<option value=">">{'>'}</option>
											<option value="<">{'<'}</option>
										</select>
									</div>
								</div>
								<div class="col-5">
									<div class="form-group pb-3">
										<label for="Maxi">Maxi</label>
										<input
											value={find_parameter?.maxi === 0 ? '' : find_parameter?.maxi}
											name="maxi"
											step="0.01"
											type="number"
											class="form-control"
											id="Maxi"
										/>
										{#if form?.maxi}
											<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
										{/if}
									</div>
								</div>
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
