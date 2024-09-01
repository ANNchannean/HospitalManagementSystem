<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import type { PageServerData, ActionData } from '../../routes/(dash)/product/$types';
	import Select from '$lib/coms/Select.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import CreateProductGroup from '$lib/coms-cu/CreateProductGroup.svelte';
	import CreateSubUnitForm from './CreateSubUnitForm.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	export let product_id: number;
	$: find_product = get_products.find((e) => e.id === product_id);
	let product_group_type_id = data.get_products.find((e) => e.id === product_id)?.group_type_id;
	$: {
		if (find_product?.group_type_id && !product_group_type_id) {
			product_group_type_id = find_product.group_type_id;
		}
	}
	$: ({ get_product_group_type, get_units, get_products } = data);
	$: units = get_units.filter((e) => e.product_group_type_id === Number(product_group_type_id));
	$: inventory = find_product?.inventory.length ? find_product?.inventory[0] : undefined;
	let loading = false;
	let subUnitForm = inventory?.subUnit.length || 0;
	$: main_unit_id = data.get_products.find((e) => e.id === product_id)?.unit_id;
</script>

<CreateProductGroup {data} />
<!-- @_Add_Product -->
<div class="modal fade" id="create-product" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			enctype="multipart/form-data"
			action={find_product?.id ? '?/update_product' : '?/create_product'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						product_id = 0;
						document.getElementById('create_product')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Product</h4>
				<button
					on:click={() => {
						product_id = 0;
						product_group_type_id = 0;
					}}
					id="create_product"
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
								<input value={find_product?.id} type="hidden" name="product_id" />
								<label for="name_product">Product Name</label>
								<input
									value={find_product?.products ?? ''}
									name="name_product"
									type="text"
									class="form-control"
									id="name_product"
								/>
								{#if form?.name_product}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="barcode">Barcode</label>
								<input
									value={find_product?.barcode ?? ''}
									name="barcode"
									type="text"
									class="form-control"
									id="barcode"
								/>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="generic_name">Generic name</label>
								<input
									value={find_product?.generic_name ?? ''}
									name="generic_name"
									type="text"
									class="form-control"
									id="generic_name"
								/>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="product_id">Product Group Type</label>
								<div class="input-group">
									<Select
										bind:value={product_group_type_id}
										name="group_type_id"
										items={get_product_group_type.map((e) => ({
											id: e.id,
											name: e.group_type
										}))}
									/>
									<button
										type="button"
										data-bs-toggle="modal"
										data-bs-dismiss="modal"
										data-bs-target="#create_product_group"
										class="btn btn-link ms-2"
										on:click={() => document.getElementById('close_create_prescription')?.click()}
										><i class="fas fa-share-square"></i>
									</button>

									{#if form?.product_id}
										<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
									{/if}
								</div>
							</div>
						</div>
						<div class="col-12">
							<div class="alert alert-secondary">
								<div class="row">
									<div class="col-3">
										<div class="form-group pb-3">
											<label for="price">Price</label>
											<input
												value={find_product?.price ?? ''}
												name="price"
												type="text"
												class="form-control"
												id="price"
											/>
											{#if form?.price}
												<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
											{/if}
										</div>
									</div>
									<div class="col-3">
										<div class="form-group pb-3">
											<label for="qty">Qty </label>
											<div class="input-group">
												<input
													class="form-control"
													value={inventory?.qty ?? ''}
													name="qty"
													type="number"
													id="qty"
												/>
											</div>
										</div>
									</div>
									<div class="col-5">
										<div class="form-group pb-3">
											<label for="unit_id">Unit </label>
											<div class="input-group">
												<Select
													bind:value={main_unit_id}
													name="unit_id"
													items={units.map((e) => ({ id: e.id, name: e.unit }))}
												/>

												{#if form?.product_id}
													<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
												{/if}
											</div>
										</div>
									</div>
									<div class="col-1">
										<label for="item"> {subUnitForm} </label>
										<div class="input-group">
											<button
												on:click={() => (subUnitForm = subUnitForm + 1)}
												type="button"
												class="btn btn-primary w-100"><i class="fa-solid fa-percent"></i></button
											>
										</div>
									</div>
								</div>
								<!-- <CreateSubUnitForm main_unit_id={main_unit_id} unit_id={0} price={0} qty={0} {units} /> -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="picture">Picture</label>
								<input
									accept="image/*"
									name="image"
									type="file"
									class="form-control"
									id="picture"
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
