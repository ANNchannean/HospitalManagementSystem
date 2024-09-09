<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { ActionData, PageServerData } from './$types';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import SelectRef from '$lib/coms/SelectRef.svelte';
	import { enhance } from '$app/forms';
	import Toast from '$lib/coms/Toast.svelte';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/coms/SubmiteSearch.svelte';
	import { browser } from '$app/environment';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import ChargeOn from '$lib/coms-billing/ChargeOn.svelte';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import ConfirmSubmit from '$lib/coms/ConfirmSubmit.svelte';
	import ConfirmeModal from '$lib/coms/ConfirmeModal.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({
		get_products,
		get_product_group_type,
		charge_on_imagerie,
		charge_on_laboratory,
		charge_on_general,
		charge_on_prescription,
		charge_on_service,
		get_billing,
		get_currency,
		charge_on_vaccine,
		get_payment_types
	} = data);

	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	let product_group_id: number;
	let inerHight: string;
	let inerHight_1: string;
	$: items =
		Number(charge_on_imagerie?.productOrder.length || 0) +
		Number(charge_on_laboratory?.productOrder.length || 0) +
		Number(charge_on_general?.productOrder.length || 0) +
		Number(charge_on_prescription?.productOrder.length || 0) +
		Number(charge_on_vaccine?.productOrder.length || 0) +
		Number(charge_on_service?.productOrder.length || 0);
	onMount(() => {
		if (browser) {
			inerHight = (window.innerHeight - (window.innerHeight * 21) / 100).toString().concat('px');
			inerHight_1 = (window.innerHeight - (window.innerHeight * 47) / 100).toString().concat('px');
			if (window.innerWidth > 990) {
				localStorage.setItem('sb|sidebar-toggle', 'true');
				const sidebarToggle = localStorage.getItem('sb|sidebar-toggle');
				if (sidebarToggle !== 'false') {
					document.getElementById('sidebarToggle')?.click();
				}
			}
		}
	});
	onDestroy(() => {
		if (browser) {
			if (window.innerWidth > 990) {
				const sidebarToggle = localStorage.getItem('sb|sidebar-toggle');
				if (sidebarToggle !== 'true') {
					document.getElementById('sidebarToggle')?.click();
				}
			}
		}
	});
</script>

{#if form?.disc}
	<Toast message="ការបញ្ជុះតម្លៃត្រូវតែជា (10% ឫ 10 )" />
{/if}
{#if form?.errProductOrder}
	<Toast message="សូមជ្រើសរើសឈ្មោះអ្នកជំងឺ!" />
{/if}
<div class="row">
	<div class="col-sm-6">
		<h2>Billing OPD</h2>
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
					><i class="fas fa-money-bills"></i>
					Billing
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-stethoscope"></i>
					OPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row g-1">
	<div class="col-md-7">
		<div class="card bg-light">
			<div class="card-header">
				<div class=" row">
					<div class="col-12 pb-2">
						<table class="table m-0">
							<tr>
								<td>ឈ្មេះអ្នកជំងឺ</td>
								<td>:</td>
								<td
									>{get_billing?.visit?.patient?.name_khmer}
									@{get_billing?.visit?.patient?.name_latin}
								</td>
								<td>
									<DateTimeFormat date={get_billing?.visit?.date_checkup} />
								</td>
							</tr>
						</table>
					</div>
					<SubmiteSearch
						placeholder="ស្វែករកតាមរយៈផលិតផល"
						items={get_products.map((e) => ({ id: e.id, name: e.products, price: e.price }))}
					/>
				</div>
			</div>
			<form
				data-sveltekit-keepfocus
				on:change={(e) => e.currentTarget.requestSubmit()}
				use:enhance={() => {
					$globalLoading = true;
					return async ({ update }) => {
						await update({ reset: false });
						$globalLoading = false;
					};
				}}
				action="?/update_product_order"
				method="post"
			>
				<div style="height: {inerHight_1}; " class=" overflow-y-auto table-responsive">
					<table class="table table-bordered table-sm">
						<thead class="table-primary table-active sticky-top top-0">
							<tr class="text-center">
								<th style="width: 45%;">Product</th>
								<th style="width: 15%;">Price</th>
								<th style="width: 10%;">Qty</th>
								<th style="width: 10%;">Disc</th>
								<th style="width: 15%;">Subtotal </th>
								<th style="width: 5%;">X</th>
							</tr>
						</thead>
						<tbody>
							<ChargeOn
								data={{
									charge_on_general: charge_on_general,
									charge_on_imagerie: charge_on_imagerie,
									charge_on_laboratory: charge_on_laboratory,
									charge_on_prescription: charge_on_prescription,
									charge_on_service: charge_on_service,
									charge_on_vaccine: charge_on_vaccine,
									get_billing: get_billing,
									get_currency: get_currency
								}}
							/>
						</tbody>
					</table>
				</div>
				<div class="card-header">
					<table class="table table-sm mt-2 fs-5">
						<tr class="">
							<td></td>
							<td>ចំនួនទំនិញ </td>
							<td>:</td>
							<td>{items} មុខ </td>
						</tr>
						<tr>
							<td></td>
							<td>សរុប </td>
							<td>:</td>
							<td>
								<Currency
									class=""
									amount={get_billing?.sub_total}
									symbol={get_currency?.currency_symbol}
								/>
							</td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td>:</td>
							<td>
								<Currency
									class=""
									rate={get_currency?.currency_rate}
									rate_to={get_currency?.exchang_rate}
									amount={get_billing?.sub_total}
									symbol={get_currency?.exchang_to}
								/>
							</td>
						</tr>
					</table>

					<hr />
					<div class="row">
						<div class="col">
							<button
								data-bs-toggle="modal"
								data-bs-target="#confirme_modal"
								type="button"
								class="btn btn-primary btn-lg w-100"
							>
								<i class="fa-regular fa-hand"></i> កត់ទុក</button
							>
						</div>
						<div class="col">
							<button
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#billing"
								formaction="?/update_billing"
								class="btn btn-success btn-lg w-100"
							>
								<i class="fa-solid fa-comments-dollar"></i> គិតលុយ</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="col-md-5">
		<div class="card bg-light">
			<form
				on:change={(e) => e.currentTarget.requestSubmit()}
				data-sveltekit-keepfocus
				class="card-header"
			>
				<div class="row">
					<div class="col-md-6">
						<div class="row">
							<div class="col">
								<SelectRef
									mainParams="?group_type_id"
									chailParams={`&${$page.url.searchParams.get('q') || ''}`}
									bind:value={product_group_id}
									items={get_product_group_type.map((e) => ({ id: e.id, name: e.group_type }))}
								/>
							</div>
						</div>
					</div>

					<div class="col-md-6">
						<input
							type="hidden"
							name="billing_id"
							value={$page.url.searchParams.get('billing_id')}
						/>
						<input
							on:input={handleQ}
							name="q"
							type="search"
							class="form-control"
							placeholder="Filter Products"
							aria-label="Filter Products"
							aria-describedby="Filter Products"
						/>
					</div>
				</div>
			</form>

			<div style="height: {inerHight};" class=" overflow-auto justify-content-start">
				{#each get_products as item}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<form
						on:click={(e) => e.currentTarget.requestSubmit()}
						style="min-height: 200px;"
						method="post"
						use:enhance={() => {
							$globalLoading = true;
							return async ({ update }) => {
								await update();
								$globalLoading = false;
							};
						}}
						action="?/create_product_order"
						class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 border m-2 p-2 btn btn-light"
					>
						<input type="hidden" name="product_id" value={item.id} />
						<input type="hidden" name="price" value={item.price} />
						<button type="button" class="position-relative text-wrap btn m-0 p-0">
							{#if item.fileOrPicture?.filename}
								<img class="img-thumbnail" src="/files/{item.fileOrPicture.filename}" alt="" />
							{:else}
								<img class="img-thumbnail" src="/no-image.jpg" alt="" />
							{/if}
							<span
								class="position-absolute start-50 translate-middle badge rounded-pill bg-danger"
							>
								<Currency class="" amount={item.price} symbol={get_currency?.currency_symbol} />
							</span>
						</button>
						<span class="fs-6 text-wrap">{item.products}</span>
					</form>
				{/each}
			</div>
		</div>
	</div>
</div>

<BillingModal
	data={{
		get_billing: get_billing,
		get_payment_types: get_payment_types,
		get_currency: get_currency
	}}
/>

<ConfirmeModal action="?/hold" id={get_billing?.id} />
