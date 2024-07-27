<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	let product_id: number;
	let loading = false;
	$: ({ get_products, get_imageerie_groups } = data);
	$: find_product = get_products.find((e) => e.id === product_id);
</script>

<DeleteModal action="?/create_ImagerieGroup" id={find_product?.id} />
<!-- @_Add_product_as_ -->
<div class="modal fade" id="create-product-as-imagerie" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_product?.id ? '?/update_ImagerieGroup' : '?/create_ImagerieGroup'}
			method="post"
			enctype="multipart/form-data"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					product_id = 0;
					if (result.type !== 'failure') document.getElementById('close')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Imagerie</h4>
				<button
					id="close"
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
								<label for="name_product">ImagerieGroup </label>
								<input
									value={find_product?.products ?? ''}
									name="name_product"
									type="text"
									class="form-control"
									id="name_product"
								/>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="imagerie_group_id">Group Type</label>
								<select
									value={find_product?.imagerie_group_id}
									id="imagerie_group_id"
									class="form-control"
									name="imagerie_group_id"
								>
									{#each get_imageerie_groups as item}
										<option value={item.id}>{item.imagerie_group}</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="price">Price</label>
								<input
									value={find_product?.price ?? ''}
									name="price"
									type="text"
									class="form-control"
									id="price"
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

<div class="row">
	<div class="col-sm-6">
		<h2>Imagerie List</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tools"></i>
					Settup
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/settup/img-list" class="btn btn-link p-0 text-secondary"
					><i class="fa-regular fa-image nav-icon"></i>
					Imagerie List
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>

					<div class="col-auto">
						<button
							on:click={() => {
								product_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-product-as-imagerie"
							><i class="fa-solid fa-square-plus"></i>
							Add ImagerieGroup
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th style="width: 30%;">Product</th>
							<th>Type</th>
							<th>Price</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_products || [] as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.products}</td>
								<td>{item.imagerieGroup?.imagerie_group ?? ''}</td>
								<td>{new Intl.NumberFormat().format(item.price)}</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												product_id = 0;
												product_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-product-as-imagerie"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												product_id = 0;
												product_id = item.id;
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
