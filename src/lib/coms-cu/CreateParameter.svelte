<script lang="ts">
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/settup/parameter/group/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import Select from '$lib/coms/Select.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	export let product_id: number | undefined;
	let loading = false;
	$: ({ get_units } = data);
</script>

<!-- @_Add_Parameter -->
<div class="modal fade" id="create_parameter" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			enctype="multipart/form-data"
			action="?/create_parameter"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						product_id = undefined;

						document.getElementById('close-parameter')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Paramater</h4>
				<button
					id="close-parameter"
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
								<input type="hidden" name="product_id" value={product_id} />
								<label for="parameter">Parameter</label>
								<input name="parameter_" type="text" class="form-control" id="parameter" />
								{#if form?.parameter_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="description">Description</label>
								<TextEditor height={200} name="description" id={product_id?.toString()} />
								{#if form?.description}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="row">
								<div class="col-6">
									<label for="unit">Unit</label>

									<div class="input-group">
										<Select
											height="200"
											name="unit_id"
											items={get_units.map((e) => ({ id: e.id, name: e.unit }))}
										/>
										<a
											href="/settup/unit"
											type="button"
											class=" btn btn-default ml-1"
											on:click={() => document.getElementById('close-parameter')?.click()}
											><i class="fas fa-share-square"></i>
										</a>
									</div>

									{#if form?.unit_id}
										<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
									{/if}
								</div>
								<div class="col-6">
									<div class="form-group pb-3">
										<label for="gender">Gender</label>
										<select name="gender" class="form-control" id="gender">
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
									<div class="form-group text-center">
										<label for="mini">Mini</label>
										<input name="mini" type="number" step="0.01" class="form-control" id="mini" />
										{#if form?.mini}
											<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
										{/if}
									</div>
								</div>
								<div class="col-2">
									<div class="form-group text-center">
										<label for="sign">Sign</label>
										<select class="form-control" name="sign" id="sign">
											<option value=""></option>
											<option value="-">{'-'}</option>
											<option value=">">{'>'}</option>
											<option value="<">{'<'}</option>
										</select>
									</div>
								</div>
								<div class="col-5">
									<div class="form-group text-center">
										<label for="Maxi">Maxi</label>
										<input name="maxi" type="number" step="0.01" class="form-control" id="Maxi" />
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
