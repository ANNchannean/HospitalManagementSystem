<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import CreateProduct from '$lib/coms-cu/CreateProduct.svelte';
	import type { EventHandler } from 'svelte/elements';
	import { inerHight } from '$lib/store';
	import Toast from '$lib/coms/Toast.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import Paginations from '$lib/coms/Paginations.svelte';
	import { _ } from '$lib/translations';
	import Select from '$lib/coms/Select.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	let product_id: number;
	$: ({ get_products, get_product_group_type, get_currency, get_units, items } = data);
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	function pushId(id: number) {
		product_id = 0;
		product_id = id;
	}
	$: find_product = get_products.filter((e) => e.id === product_id);
	let page: number = 1;
	let limit: number;
	$: n = page === 1 ? 1 : limit * page - limit + 1;
</script>

<DeleteModal action="?/delete_product" id={get_products.find((e) => e.id === product_id)?.id} />
<CreateProduct
	data={{
		get_product_group_type: get_product_group_type,
		get_units: get_units,
		get_products: find_product,
		get_currency: get_currency
	}}
	{form}
	bind:product_id
/>
{#if form?.serverError}
	<Toast toas="error" message="Can't delete" />
{/if}
<div class="row">
	<div class="col-sm-6">
		<h2>{$_('list_products')}</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					{$_('home')}
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/product" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-briefcase-medical"></i>
					{$_('products')}
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
					on:change={({ currentTarget }) => currentTarget.requestSubmit()}
					class="row gap-1"
				>
					<input type="hidden" name="page" value={page} />
					<input type="hidden" name="limit" value={limit} />
					<div class="col-sm-3">
						<Select
							
							name="group_type_id"
							selectType="param"
							displayName={$_('product_group')}
							items={get_product_group_type.map((e) => ({ id: e.id, name: e.group_type }))}
						/>
					</div>
					<div class="col-sm-3">
						<input
							on:input={handleQ}
							type="search"
							name="q"
							class="form-control float-right"
							placeholder={$_('search')}
						/>
					</div>
					<div class="col text-end">
						<button
							on:click={() => {
								product_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-product"
							><i class="fa-solid fa-square-plus"></i>
							{$_('new_product')}
						</button>
					</div>
				</form>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0 m-0">
				<table class="table table-hover table-bordered">
					<thead class="sticky-top top-0 bg-light table-active">
						<tr>
							<th style="width: 3%;" class="text-center">{$_('n')}</th>
							<th style="width: 3%;" class="text-center">#</th>
							<th style="width: 4%;">{$_('picture')}</th>
							<th style="width: 15%;">{$_('products')}</th>
							<th style="width: 10%;">{$_('generic_name')}</th>
							<th style="width: 10%;">{$_('product_group')}</th>
							<th style="width: 10%;">{$_('unit')}</th>
							<th style="width: 5%;">{$_('price')}</th>
							<th style="width: 10%;">{$_('action')}</th>
						</tr>
					</thead>
					<tbody>
						{#each get_products as item, index}
							<tr>
								<td class="text-center">{n + index}</td>
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
								<td>
									<Currency amount={item?.price} symbol={get_currency?.currency_symbol} />
								</td>
								<td>
									<div class=" m-0 p-0">
										<button
											on:click={() => {
												pushId(item.id);
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-product"
											><i class="fa-solid fa-file-pen"></i>
										</button>
										<button
											on:click={() => {
												product_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
										</button>
										<button
											on:click={() => {
												product_id = item.id;
											}}
											type="button"
											class="btn btn-info btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-boxes-stacked"></i>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="card-footer fixed-bottom position-relative">
				<Paginations {items} bind:limit bind:page />
			</div>
		</div>
	</div>
</div>
