<script lang="ts">
	import { enhance } from '$app/forms';
	import { _ } from '$lib/translations';
	import type { PageServerData, ActionData } from '../../routes/(dash)/medicine/list/$types';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Select from '$lib/coms/Select.svelte';
	type Data = Pick<PageServerData, 'get_unit_as_medicineType' | 'get_products'>;
	export let data: Data;
	export let form: ActionData;
	export let product_id: number;
	$: ({ get_unit_as_medicineType, get_products } = data);
	$: find_medicine = get_products[0];
	let loading = false;
</script>

<!-- @_Add_Patient -->
<div class="modal fade" id="create-medicine" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_medicine?.id ? '?/update_medicine' : '?/create_medicine'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						product_id = 0;
						document.getElementById('create_medicine')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Medicine</h4>
				<button
					on:click={() => (product_id = 0)}
					id="create_medicine"
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
								<input value={find_medicine?.id} type="hidden" name="product_id" />
								<label for="name_product">Name Product</label>
								<input
									value={find_medicine?.products ?? ''}
									name="name_product"
									type="text"
									class="form-control"
									id="name_product"
								/>
								{#if form?.name_product}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="medicine_type_id">Medicine Type</label>
								<Select
									value={find_medicine?.unit_id}
									name="unit_id"
									items={get_unit_as_medicineType.map((e) => ({ id: e.id, name: e.unit }))}
								/>

								{#if form?.unit_id}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="price">Price</label>
								<input
									value={find_medicine?.price ?? ''}
									name="price"
									type="text"
									class="form-control"
									id="price"
								/>
								{#if form?.price}
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
