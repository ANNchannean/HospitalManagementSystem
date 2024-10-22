<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/coms/SubmiteSearch.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import ConfirmeModal from '$lib/coms/ConfirmeModal.svelte';
	import ChargeGeneral from '$lib/coms-billing/ChargeGeneral.svelte';
	import Select from '$lib/coms/Select.svelte';
	import ProductAddToCard from '$lib/coms-billing/ProductAddToCard.svelte';
	import { _ } from '$lib/translations';
	export let data: PageServerData;
	$: ({
		get_products,
		get_product_group_type,
		charge_on_general,
		get_billing,
		get_currency,
		get_payment_types,
		get_patients,
		get_billings_due
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
	let inerHight_1: string;
	$: items = Number(charge_on_general?.productOrder.length || 0);
	let patient_id = data.get_billing?.patient_id;
</script>

<div class="row">
	<div class="col-sm-6">
		<h2>{$_('billing_opd')}</h2>
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
					><i class="fas fa-money-bill-1-wave"></i>
					{$_('opd')}
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row g-1">
	<div class="col-md-7">
		<div class="card bg-light">
			<div class="card-header">
				<div class="row">
					<div class="col-2">{$_('patient')}</div>
					<div class="col-10">
						<Select
							action="?/add_patient"
							selectType="submit"
							name="patient_id"
							bind:value={patient_id}
							items={get_patients.map((e) => ({
								id: e.id,
								name: e.name_khmer
									.concat(` ${e.name_latin}`)
									.concat(` ,${e.gender}`)
									.concat(` ,${e.village?.type} ${e.village?.name_khmer}`)
									.concat(` ${e.commune?.type} ${e.commune?.name_khmer}`)
									.concat(` ${e.district?.type} ${e.district?.name_khmer}`)
									.concat(` ${e.provice?.type} ${e.provice?.name_khmer}`)
							}))}
						/>
					</div>
					<div class="col-12 pt-2">
						<SubmiteSearch
							billing_id={get_billing?.id}
							placeholder={$_('search')}
							items={get_products.map((e) => ({ id: e.id, name: e.products, price: e.price }))}
						/>
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
					<table class="fs-5 table text-nowrap">
						<tr class="">
							<td>{$_('items_goods')}</td>
							<td> : </td>
							<td>{items} {$_('items')} </td>
						</tr>
						<tr>
							<td>{$_('total_all')} {get_currency?.currency} </td>
							<td> : </td>
							<td>
								<Currency
									class=""
									amount={get_billing?.sub_total}
									symbol={get_currency?.currency_symbol}
								/>
							</td>
						</tr>
						<tr>
							<td>{$_('total_all')} {get_currency?.exchang_to} </td>
							<td> : </td>
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
									>{$_('previous_debt')} <DateTimeFormat date={item.created_at} timeStyle={false} />
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
				get_products: get_products,
				get_billing: get_billing
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
