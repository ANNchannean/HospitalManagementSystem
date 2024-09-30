<script lang="ts">
	import type { ActionData, PageServerData } from '../../routes/(dash)/medicine/type/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { _ } from '$lib/translations';
	type Data = Pick<PageServerData, 'get_unit_as_medicine'>;
	export let unit_id: number;
	export let form: ActionData;
	export let data: Data;
	$: ({ get_unit_as_medicine } = data);
	$: find_unit = get_unit_as_medicine[0];
	let loading = false;
</script>

<!-- @_Add_MedicineType -->
<div class="modal fade" id="create-medicine-type" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_unit?.id ? '?/update_medicine_type' : '?/create_medicine_type'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						unit_id = 0;
						document.getElementById('close_create_medicine_type')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Medicine Type</h4>
				<button
					id="close_create_medicine_type"
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
								<input value={find_unit?.id} type="hidden" name="medicine_type_id" />
								<label for="medicine_type">Name</label>
								<input
									value={find_unit?.unit ?? ''}
									name="medicine_type"
									type="text"
									class="form-control"
									id="medicine_type"
								/>
								{#if form?.medicine_type}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
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
