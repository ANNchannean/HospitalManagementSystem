<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import CreateProduct from '$lib/components/createORupdate/CreateProduct.svelte';
	import type { EventHandler } from 'svelte/elements';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let product_id: number;
	$: ({ get_products, get_product_group_type } = data);
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
</script>

<DeleteModal action="?/delete_product" id={get_products.find((e) => e.id === product_id)?.id} />
<CreateProduct {data} {form} {product_id} />

<div class="row">
	<div class="col-sm-6">
		<h2>List products</h2>
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
				<a href="/product" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-briefcase-medical"></i>
					Product
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<form
					data-sveltekit-keepfocus
					on:change={(e) => e.currentTarget.requestSubmit()}
					class=" row"
				>
					<div class="col">
						<select id="group_type_id" class="form-control" name="group_type_id">
							<option value="">ProductGroup</option>
							{#each get_product_group_type as item}
								<option value={item.id}>{item.group_type}</option>
							{/each}
						</select>
					</div>
					<div class="col">
						<input
							on:input={handleQ}
							type="search"
							name="q"
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
							data-bs-target="#create-product"
							><i class="fa-solid fa-square-plus"></i>
							New product
						</button>
					</div>
				</form>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0 m-0">
				<table class="table table-hover table-bordered">
					<thead class="position-sticky top-0 bg-light table-active">
						<tr>
							<th style="width: 5%;" class="text-center">N</th>
							<th style="width: 3%;" class="text-center">#</th>
							<th>Picture</th>
							<th>Product</th>
							<th>GenericName</th>
							<th>ProductGroup</th>
							<th>Unit</th>
							<th>Price</th>
							<th style="width: 15%;">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_products as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td class="text-center">{item.id}</td>
								<td class="text-center">
									<img
										src={item.fileOrPicture?.filename
											? `/files/${item.fileOrPicture?.filename}`
											: '/no-image.jpg'}
										alt=""
										height="30"
										class=""
									/>
								</td>
								<td>{item.products}</td>
								<td>{item.generic_name ?? ''}</td>
								<td>
									{item.productGroupType?.group_type ?? ''}
								</td>
								<td>
									{item.unit?.unit ?? ''}
								</td>
								<td
									>{new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' }).format(
										item.price
									)}</td
								>
								<td>
									<div class=" m-0 p-0">
										<button
											on:click={() => {
												product_id = 0;
												product_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-product"
											><i class="fa-solid fa-file-pen"></i>
										</button>
										<button
											on:click={() => {
												product_id = 0;
												product_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
										</button>
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
