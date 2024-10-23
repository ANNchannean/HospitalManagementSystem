<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/coms/SubmiteSearch.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import ProductAddToCard from '$lib/coms-billing/ProductAddToCard.svelte';
	import ChargePrescription from '$lib/coms-billing/ChargePrescription.svelte';
	import ChargeService from '$lib/coms-billing/ChargeService.svelte';
	import ChargeBed from '$lib/coms-billing/ChargeBed.svelte';
	import ChargeGeneral from '$lib/coms-billing/ChargeGeneral.svelte';
	import { _ } from '$lib/translations';
	import ChargeImagerie from '$lib/coms-billing/ChargeImagerie.svelte';
	import ChargeLaboratory from '$lib/coms-billing/ChargeLaboratory.svelte';
	import ChargeVaccine from '$lib/coms-billing/ChargeVaccine.svelte';
	import { calculateDifference } from '$lib/helper';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	export let data: PageServerData;
	$: ({
		get_products,
		get_product_group_type,
		get_progress_note,
		get_currency,
		total_daily,
		get_payment_types
	} = data);
	$: main_billing = get_progress_note?.billing;
	$: main_charge_on_bed_ = main_billing?.charge.find((e) => e.charge_on === 'bed');
	$: main_charge_on_general_ = main_billing?.charge.find((e) => e.charge_on === 'general');
	$: main_charge_on_prescription_ = main_billing?.charge.find(
		(e) => e.charge_on === 'prescription'
	);
	$: main_charge_on_service_ = main_billing?.charge.find((e) => e.charge_on === 'service');
	$: getDayStay = calculateDifference(
		get_progress_note?.date_checkup,
		get_progress_note?.date_checkout
	);
	let inerHight_1: string;
	let full_screen = false;
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

<div class="row">
	<div class:col-md-12={full_screen} class:col-md-6={!full_screen}>
		<div class="card bg-light">
			<div class="card-header">
				<div class=" row">
					<div class="col-12 pb-2">
						<table class="table m-0">
							<tr>
								<td>{$_('patient')}</td>
								<td>:</td>
								<td
									>{get_progress_note?.patient?.name_khmer}
									@{get_progress_note?.patient?.name_latin}
								</td>
								<td>
									<DateTimeFormat date={get_progress_note?.date_checkup} />
								</td>
								<button
									type="button"
									on:click={() => (full_screen = !full_screen)}
									class="btn btn-sm btn-link my-0 py-0"
								>
									{#if full_screen}
										<i class="fa-solid fa-arrow-left"></i>
									{:else}
										<i class="fa-solid fa-arrow-right"></i>
									{/if}
								</button>
							</tr>
						</table>
					</div>
					<SubmiteSearch
						billing_id={get_progress_note?.billing?.id}
						placeholder={$_('search')}
						items={get_products.map((e) => ({ id: e.id, name: e.products, price: e.price }))}
					/>
				</div>
			</div>
			<div style="height: {inerHight_1}; " class=" overflow-y-auto table-responsive">
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
					action="/billing/n/{main_billing?.id}/?/update_product_order"
					method="post"
				>
					<table class="table table-bordered my-0 py-0 table-sm text-nowrap">
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
							<tr class="text-bg-success">
								<td colspan="6">
									{$_('from_date')}
									<DateTimeFormat date={get_progress_note?.date_checkup} />
									{$_('to_date')}
									<DateTimeFormat date={get_progress_note?.date_checkout} />
									{$_('duration_of_treatment')}
									{#if getDayStay?.days}
										{getDayStay?.days}
										<span>{$_('day')}</span>
									{/if}
									{#if getDayStay?.hours}
										{getDayStay?.hours}
										<span>{$_('hour')}</span>
									{/if}
								</td>
							</tr>
							<ChargeService
								data={{
									charge_on_service: main_charge_on_service_,
									get_currency: get_currency
								}}
							/>
							{#if get_progress_note?.billing?.progressNote?.presrciption.length}
								<tr>
									<td class="text-bg-success" colspan="6">
										{$_('prescription')}
									</td>
								</tr>
							{/if}
							<ChargePrescription
								data={{
									charge_on_prescription: main_charge_on_prescription_,
									get_currency: get_currency,
									get_billing: main_billing || undefined
								}}
							/>
							<ChargeGeneral
								data={{
									charge_on_general: main_charge_on_general_,
									get_currency: get_currency
								}}
							/>
						</tbody>
						{#each get_progress_note?.visit || [] as item}
							{@const charge_on_general = item.billing?.charge.find(
								(e) => e.charge_on === 'general'
							)}
							{@const charge_on_service = item.billing?.charge.find(
								(e) => e.charge_on === 'service'
							)}
							{@const charge_on_prescription = item.billing?.charge.find(
								(e) => e.charge_on === 'prescription'
							)}

							{@const charge_on_laboratory = item.billing?.charge.find(
								(e) => e.charge_on === 'laboratory'
							)}
							{@const charge_on_vaccine = item.billing?.charge.find(
								(e) => e.charge_on === 'vaccine'
							)}
							{@const charge_on_imagerie = item.billing?.charge.find(
								(e) => e.charge_on === 'imagerie'
							)}
							<tbody>
								<tr class="text-bg-secondary">
									<td colspan="6">
										<span class="">
											#<DateTimeFormat date={item.date_checkup} />
										</span>
										<span class="text-danger">
											{#if item.billing?.status !== 'checking'}
												#{$_('already_charged')}
											{/if}
										</span>
									</td>
								</tr>
								<ChargeService
									data={{
										charge_on_service: charge_on_service,
										get_currency: get_currency
									}}
								/>
								<ChargeImagerie
									data={{
										charge_on_imagerie: charge_on_imagerie,
										get_currency: get_currency
									}}
								/>
								<ChargeLaboratory
									data={{
										charge_on_laboratory: charge_on_laboratory,
										get_currency: get_currency
									}}
								/>
								<ChargeVaccine
									data={{
										charge_on_vaccine: charge_on_vaccine,
										get_currency: get_currency
									}}
								/>
								<ChargePrescription
									data={{
										charge_on_prescription: charge_on_prescription,
										get_currency: get_currency,
										get_billing: item.billing ?? undefined
									}}
								/>
								<ChargeGeneral
									data={{
										charge_on_general: charge_on_general,
										get_currency: get_currency
									}}
								/>
							</tbody>
						{/each}
					</table>
				</form>
			</div>
			<div class="card-header">
				<table class="table table-sm mt-2 fs-6">
					<tr class="">
						<td></td>
						<td>{$_('items_goods')}</td>
						<td>:</td>
						<!-- <td>{items} មុខ </td> -->
					</tr>
					<tr>
						<td></td>
						<td>{$_('total_all')} </td>
						<td>:</td>
						<td> .. </td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td>:</td>
						<td> .. </td>
					</tr>
				</table>

				<hr />
				<div class="row">
					<!-- <div class="col">
							<button class="btn btn-danger btn-lg w-100">
								<i class="fa-solid fa-eraser"></i> លុប</button
							>
						</div> -->
					<div class="col">
						<button type="button" class="btn btn-primary btn-lg w-100">
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
		</div>
	</div>
	{#if !full_screen}
		<div class="col-md-6">
			<ProductAddToCard
				bind:inerHight_1
				data={{
					get_currency: get_currency,
					get_product_group_type: get_product_group_type,
					get_products: get_products,
					get_billing: get_progress_note?.billing || undefined
				}}
			/>
		</div>
	{/if}
</div>

<BillingModal
	data={{
		get_billing: get_progress_note?.billing || undefined,
		get_currency: get_currency,
		get_payment_types: get_payment_types
	}}
	{total_daily}
/>
