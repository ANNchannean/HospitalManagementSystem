<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/coms/SubmiteSearch.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import ConfirmeModal from '$lib/coms/ConfirmeModal.svelte';
	import ChargeService from '$lib/coms-billing/ChargeService.svelte';
	import ChargeGeneral from '$lib/coms-billing/ChargeGeneral.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { _ } from '$lib/translations';
	export let data: PageServerData;
	$: ({
		get_products,
		charge_on_general,
		charge_on_service,
		get_billing,
		get_currency,
		get_payment_types,
		get_billings_due
	} = data);

	let inerHight_1: string;
	$: items =
		Number(charge_on_general?.productOrder.length || 0) +
		Number(charge_on_service?.productOrder.length || 0);

	onMount(() => {
		if (browser) {
			inerHight_1 = (window.innerHeight - (window.innerHeight * 45) / 100).toString().concat('px');
		}
	});
</script>

<div class="row">
	<div class="col-sm-6">
		<h2>{$_('billing_ipd')}</h2>
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
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-money-bills"></i>
					{$_('billing')}
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-stethoscope"></i>
					{$_('ipd')}
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row g-1">
	<div class="col-md-12">
		<div class="card bg-light">
			<div class="card-header">
				<div class="row px-2">
					<div class="col-12 pb-2">
						<table class="table m-0">
							<tr>
								<td>{$_('patient_name')}</td>
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
				action="/billing/n/{get_billing?.id}/?/update_product_order"
				method="post"
			>
				<div style="height: {inerHight_1}; " class=" overflow-y-auto table-responsive">
					<table class="table table-bordered table-sm text-nowrap">
						<thead class="table-primary table-active sticky-top top-0">
							<tr class="text-center">
								<th style="width: 45%;">{$_('products')}</th>
								<th style="width: 15%;">{$_('price')}</th>
								<th style="width: 10%;">{$_('qty')}</th>
								<th style="width: 10%;">{$_('discount')}</th>
								<th style="width: 15%;">{$_('total')} </th>
								<th style="width: 5%;">X</th>
							</tr>
						</thead>
						<tbody>
							<ChargeService
								data={{
									charge_on_service: charge_on_service,
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
							<td>{$_('items_goods')} </td>
							<td>:</td>
							<td>{items} {$_('items')} </td>
						</tr>
						<tr>
							<td></td>
							<td>{$_('total')} </td>
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
										<a href="/billing/ipd/{item.id}">
											<Currency
												class=""
												amount={item.balance}
												symbol={get_currency?.currency_symbol}
											/></a
										>
									{:else if item.billing_type === 'OPD'}
										<a href="/billing/opd/{item.id}"
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
								class="btn btn-success btn-lg w-100"
							>
								<i class="fa-solid fa-comments-dollar"></i> {$_('payment')}</button
							>
						</div>
					</div>
				</div>
			</form>
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
