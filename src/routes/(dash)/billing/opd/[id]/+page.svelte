<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import Toast from '$lib/coms/Toast.svelte';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/coms/SubmiteSearch.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import ConfirmeModal from '$lib/coms/ConfirmeModal.svelte';
	import ChargeLaboratory from '$lib/coms-billing/ChargeLaboratory.svelte';
	import ChargeImagerie from '$lib/coms-billing/ChargeImagerie.svelte';
	import ChargePrescription from '$lib/coms-billing/ChargePrescription.svelte';
	import ChargeService from '$lib/coms-billing/ChargeService.svelte';
	import ChargeVaccine from '$lib/coms-billing/ChargeVaccine.svelte';
	import ChargeGeneral from '$lib/coms-billing/ChargeGeneral.svelte';
	import ProductAddToCard from '$lib/coms-billing/ProductAddToCard.svelte';
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
		get_payment_types,
		get_billings_due,
	} = data);

	let inerHight_1: string;
	$: items =
		Number(charge_on_imagerie?.productOrder.length || 0) +
		Number(charge_on_laboratory?.productOrder.length || 0) +
		Number(charge_on_general?.productOrder.length || 0) +
		Number(charge_on_prescription?.productOrder.length || 0) +
		Number(charge_on_vaccine?.productOrder.length || 0) +
		Number(charge_on_service?.productOrder.length || 0);
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
				<div class="row px-2">
					<div class="col-12 pb-2">
						<table class="table m-0">
							<tr>
								<td>ឈ្មេះអ្នកជំងឺ</td>
								<td>:</td>
								<td
									>{get_billing?.patient?.name_khmer}
									@{get_billing?.patient?.name_latin}
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
					<table class="table table-bordered table-sm text-nowrap">
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
							<ChargeLaboratory
								data={{
									charge_on_laboratory: charge_on_laboratory,
									get_currency: get_currency
								}}
							/>
							<ChargeImagerie
								data={{
									charge_on_imagerie: charge_on_imagerie,
									get_currency: get_currency
								}}
							/>
							<ChargePrescription
								data={{
									charge_on_prescription: charge_on_prescription,
									get_currency: get_currency,
									get_billing: get_billing
								}}
							/>
							<ChargeService
								data={{
									charge_on_service: charge_on_service,
									get_currency: get_currency
								}}
							/>
							<ChargeVaccine
								data={{
									charge_on_vaccine: charge_on_vaccine,
									get_currency: get_currency
								}}
							/>
							<ChargeGeneral
								data={{
									charge_on_general: charge_on_general,
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
						{#each get_billings_due as item (item.id)}
							<tr>
								<td
									>ប្រាក់ជំពាក់លើកមុន <DateTimeFormat date={item.created_at} timeStyle={false} />
								</td>
								<td> : </td>
								<td>
									{#if item.billing_type === 'IPD'}
										<a href="/billing/multiple/{item.id}">
											<Currency
												class=""
												amount={item.balance}
												symbol={get_currency?.currency_symbol}
											/></a
										>
									{:else if item.billing_type === 'OPD'}
										<a href="/billing/single/{item.id}"
											><Currency
												class=""
												amount={item.balance}
												symbol={get_currency?.currency_symbol}
											/></a
										>
									{:else}
										<a href="/billing/pos/{item.id}"
											><Currency
												class=""
												amount={item.balance}
												symbol={get_currency?.currency_symbol}
											/></a
										>
									{/if}
								</td>
							</tr>
						{/each}
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
		<ProductAddToCard
			bind:inerHight_1
			data={{
				get_currency: get_currency,
				get_product_group_type: get_product_group_type,
				get_products: get_products
			}}
		/>
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
