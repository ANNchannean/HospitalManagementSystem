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
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { browser } from '$app/environment';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import ChargeOn from '$lib/coms-billing/ChargeOn.svelte';
	import BillingModal from '$lib/coms-billing/BillingModal.svelte';
	import ProductAddToCard from '$lib/coms-billing/ProductAddToCard.svelte';
	import ChargeLaboratory from '$lib/coms-billing/ChargeLaboratory.svelte';
	import ChargeImagerie from '$lib/coms-billing/ChargeImagerie.svelte';
	import ChargePrescription from '$lib/coms-billing/ChargePrescription.svelte';
	import ChargeService from '$lib/coms-billing/ChargeService.svelte';
	import ChargeVaccine from '$lib/coms-billing/ChargeVaccine.svelte';
	import ChargeBed from '$lib/coms-billing/ChargeBed.svelte';
	import ChargeGeneral from '$lib/coms-billing/ChargeGeneral.svelte';
	import { _ } from '$lib/translations';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_products, get_product_group_type, get_progress_note, get_currency } = data);
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
	let disc = '';
	let bank_pay = 0;
</script>

{#if form?.disc}
	<Toast message="ការបញ្ជុះតម្លៃត្រូវតែជា (10% ឫ 10 )" />
{/if}
{#if form?.errProductOrder}
	<Toast message="សូមជ្រើសរើសឈ្មោះអ្នកជំងឺ!" />
{/if}
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
	<div class="col-md-6">
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
							</tr>
						</table>
					</div>
					<SubmiteSearch
						placeholder={$_('search')}
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
								<th style="width: 45%;">{$_('products')}</th>
								<th style="width: 15%;">{$_('price')}</th>
								<th style="width: 10%;">{$_('qty')}</th>
								<th style="width: 10%;">{$_('discount')}</th>
								<th style="width: 15%;">{$_('total')} </th>
								<th style="width: 5%;">X</th>
							</tr>
						</thead>
						<tbody>
							{#each get_progress_note?.visit || [] as item}
								{@const charge_on_imagerie = item.billing?.charge.find(
									(e) => e.charge_on === 'imagerie'
								)}
								{@const charge_on_laboratory = item.billing?.charge.find(
									(e) => e.charge_on === 'laboratory'
								)}
								{@const charge_on_general = item.billing?.charge.find(
									(e) => e.charge_on === 'general'
								)}
								{@const charge_on_service = item.billing?.charge.find(
									(e) => e.charge_on === 'service'
								)}
								{@const charge_on_prescription = item.billing?.charge.find(
									(e) => e.charge_on === 'prescription'
								)}
								{@const charge_on_vaccine = item.billing?.charge.find(
									(e) => e.charge_on === 'vaccine'
								)}
								{@const charge_on_bed = item.billing?.charge.find((e) => e.charge_on === 'bed')}
								<tr>
									<span class="">
										#<DateTimeFormat date={item.date_checkup} />
									</span>
									<span class="text-danger">
										{#if item.billing?.status !== 'active'}
											#{$_('already_charged')}
										{/if}
									</span>
								</tr>
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
										get_billing: item.billing ?? undefined
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
								<ChargeBed
									data={{
										charge_on_bed: charge_on_bed,
										get_currency: get_currency
									}}
								/>
								<ChargeGeneral
									data={{
										charge_on_general: charge_on_general,
										get_currency: get_currency
									}}
								/>
								<!-- <ChargeOn
									data={{
										charge_on_general: charge_on_general,
										charge_on_imagerie: charge_on_imagerie,
										charge_on_laboratory: charge_on_laboratory,
										charge_on_service: charge_on_service,
										charge_on_prescription: charge_on_prescription,
										charge_on_vaccine: charge_on_vaccine,
										get_billing: item?.billing ?? undefined,
										get_currency: get_currency,
										charge_on_bed: charge_on_bed
									}}
								/> -->
								<br />
							{/each}
						</tbody>
					</table>
				</div>
				<div class="card-header">
					<table class="table table-sm mt-2 fs-5">
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
								data-bs-target="#item.billing"
								formaction="?/update_item.billing"
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
	<div class="col-md-6">
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

<!-- <item.BillingModal {data} /> -->
