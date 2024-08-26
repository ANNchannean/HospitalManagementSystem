<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import CreateMedicine from '$lib/coms-cu/CreateMedicine.svelte';
	import { inerHight } from '$lib/store';
	import CurrencySimble from '$lib/coms/CurrencySimble.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	let product_id: number;
	$: ({ get_products } = data);
	$: find_medicine = get_products.find((e) => e.id === product_id);
</script>

<DeleteModal action="?/delete_medicine" id={find_medicine?.id} />
<CreateMedicine {form} {product_id} {data} />

<div class="row">
	<div class="col-sm-6">
		<h2 class="">List Medicine</h2>
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
				<a href="/medicine/list" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tablets nav-icon"></i>
					Medicine
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
						<input type="text" name="table_search" class="form-control" placeholder="Search" />
					</div>
					<div class="col-auto">
						<button
							on:click={() => {
								product_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-medicine"
							><i class="fa-solid fa-square-plus"></i>
							New Medicine
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="sticky-top bg-light table-active">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th style="width: 30%;">Product</th>
							<th style="width: 20%;">Medicine Type</th>
							<th>Price &#x17DB;</th>
							<th>Price &#36;</th>
							<th style="width: 20%;">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_products as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.products}</td>
								<td>{item.unit?.unit}</td>
								<td>
									<CurrencySimble show="real" break_line={true} value={item.price} />
								</td>
								<td>
									<CurrencySimble show="dorlar" break_line={true} value={item.price} />
								</td>
								<td>
									<div>
										<button
											on:click={() => {
												product_id = 0;
												product_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-medicine"
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
