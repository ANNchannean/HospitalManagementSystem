<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import type { ActionData, PageServerData } from '../../routes/(dash)/settup/unit/$types';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Select from '$lib/coms/Select.svelte';
	export let form: ActionData;
	export let unit_id: number;
	export let data: PageServerData;
	$: ({ get_units, get_product_group_types } = data);
	$: find_unit = get_units.find((e) => e.id === unit_id);

	let loading = false;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="create_unit" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			action={find_unit?.id ? '?/update_unit' : '?/create_unit'}
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						unit_id = 0;
						document.getElementById('close_create_unit')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<div class="modal-header">
				<h4 class="modal-title">Unit List</h4>
				<button
					id="close_create_unit"
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
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_unit?.id} type="hidden" name="unit_id" />
								<label for="unit_">Unit</label>
								<input
									value={find_unit?.unit ?? ''}
									name="unit_"
									type="text"
									class="form-control"
									id="unit_"
								/>
								{#if form?.unit_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="unit_">Product Group Type</label>
								<Select
									name="product_group_type_id"
									value={find_unit?.product_group_type_id}
									items={get_product_group_types.map((e) => ({ id: e.id, name: e.group_type }))}
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
