<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData, ActionData } from './$types';
	import { inerHight } from '$lib/store';
	import ViewPayBilling from '$lib/coms-billing/ViewPayBilling.svelte';
	import AddPayBilling from '$lib/coms-billing/AddPayBilling.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import Paginations from '$lib/coms/Paginations.svelte';
	import Select from '$lib/coms/Select.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_billings, get_currency, get_payment_types, items, get_patients } = data);
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	let billing_id = 0;
	$: find_billing = get_billings.filter((e) => e.id === billing_id) || [];
	let page: number = 1;
	let limit: number;
	$: n = page === 1 ? 1 : limit * page - limit + 1;
	let patient_id: number;
</script>

<ViewPayBilling data={{ get_billings: get_billings, get_currency: get_currency }} {billing_id} />
<AddPayBilling
	balance={find_billing[0]?.balance}
	data={{ get_billings: find_billing, get_currency, get_payment_types }}
	{form}
/>

<div class="row">
	<div class="col-sm-6">
		<h2>Sale Report</h2>
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
					><i class="fa-solid fa-file"></i>
					Sale report
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
					class="row g-1"
				>
					<input type="hidden" name="page" value={page} />
					<input type="hidden" name="limit" value={limit} />
					<!-- <input type="hidden" name="patient_id" value={patient_id} /> -->
					<div class="col-sm-2">
						<div class="input-group">
							<span class="input-group-text">Start</span>
							<input type="date" name="start" class="form-control" />
						</div>
					</div>
					<div class="col-sm-2">
						<div class="input-group">
							<input type="date" name="end" class="form-control" />
							<span class="input-group-text">End</span>
						</div>
					</div>
					<div class="col-sm-3">
						<Select
							bind:value={patient_id}
							displayName="Patient"
							selectType="param"
							name="patient_id"
							items={get_patients.map((e) => ({
								id: e.id,
								name: e.name_khmer.concat(` ${e.name_latin}`)
							}))}
						/>
					</div>
					<div class="col-sm-2">
						<div class="input-group">
							<span class="input-group-text">Status</span>
							<select name="status" id="status" class="form-control">
								<option value="">All</option>
								<option value="paid">Paid</option>
								<option value="due">Due</option>
								<option value="partial">Partial</option>
							</select>
						</div>
					</div>
					<div class="col-sm-2">
						<div class="input-group">
							<span class="input-group-text">BillingType</span>
							<select name="billing_type" id="billing_type" class="form-control">
								<option value="">All</option>
								<option value="OPD">OPD</option>
								<option value="IPD">IPD</option>
								<option value="POS">POS</option>
							</select>
						</div>
					</div>
				</form>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered table-hover text-nowrap">
					<thead class="sticky-top top-0 bg-light table-active">
						<tr class="text-center">
							<th>N</th>
							<th>ID</th>
							<th>Date</th>
							<th>V-Type</th>
							<th>Patient</th>
							<th>Gender</th>
							<th>Age</th>
							<th>Contact</th>
							<th>Seller</th>
							<th>Sub Total</th>
							<th>Disc</th>
							<th>Total</th>
							<th>Tax</th>
							<th>Grad Total</th>
							<th>Paid</th>
							<th>Balance</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_billings as item, index (item.id)}
							<tr class="text-center">
								<td>
									{n + index}
								</td>
								<td>
									{item.id}
								</td>

								<td>
									<DateTimeFormat timeStyle={false} date={item.created_at} /> <br />
									<DateTimeFormat dateStyle={false} date={item.created_at} />
								</td>
								<td>
									{item?.checkin_type || ''}
								</td>
								<td>
									{#if !item.patient}
										<span>General</span>
									{:else}
										<span class="">
											{item.patient?.name_khmer ?? ''}
										</span>
										<br />
										<span class="">
											{item.patient?.name_latin ?? ''}
										</span>
									{/if}
								</td>
								<td>{item.patient?.gender ?? ''}</td>
								<td>{item.patient?.age ?? ''}</td>
								<td>{item.patient?.telephone ?? ''}</td>

								<td></td>

								<td>
									<Currency
										class=""
										amount={item.sub_total}
										symbol={get_currency?.currency_symbol}
									/>
								</td>

								<td>
									{#if item.discount.includes('%')}
										{item.discount}
									{:else if Number(item.discount) > 0}
										<Currency
											class=""
											amount={+item.discount}
											symbol={get_currency?.currency_symbol}
										/>
									{/if}
								</td>
								<td>
									<Currency class="" amount={+item.total} symbol={get_currency?.currency_symbol} />
								</td>
								<td>{item.tax}</td>
								<td>
									<Currency
										class=""
										amount={item.total_after_tax}
										symbol={get_currency?.currency_symbol}
									/>
								</td>
								<td>
									<Currency class="" amount={item.paid} symbol={get_currency?.currency_symbol} />
								</td>
								<td>
									<Currency class="" amount={item.balance} symbol={get_currency?.currency_symbol} />
								</td>
								<td>
									{#if item.status === 'paid'}
										<span class="badge text-bg-success">{item.status ?? ''}</span>
									{:else if item.status === 'partial'}
										<span class="badge text-bg-warning">{item.status ?? ''}</span>
									{:else if item.status === 'due'}
										<span class="badge text-bg-danger">{item.status ?? ''}</span>
									{/if}
								</td>
								<td>
									<!-- Example single danger button -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										on:click={() => {
											billing_id = 0;
											billing_id = item.id;
										}}
										class="btn-group"
									>
										<a target="_blank" href="/report/{item.id}/billing" class="btn btn-success"
											><i class="fa-solid fa-receipt"></i></a
										>

										<button
											data-bs-toggle="modal"
											data-bs-target="#view_pay_billing"
											class="btn btn-success"><i class="fa-solid fa-comments-dollar"></i></button
										>

										<button
											disabled={item.balance <= 0}
											data-bs-toggle="modal"
											data-bs-target="#add_pay_billing"
											class="btn btn-success"><i class="fa-solid fa-money-check-dollar"></i></button
										>
										{#if item.checkin_type === 'POS'}
											<a href="/billing/pos/{billing_id}" class="btn btn-primary"
												><i class="fa-solid fa-file-pen"></i></a
											>
										{:else}
											<a href="/billing/single/{billing_id}" class="btn btn-primary"
												><i class="fa-solid fa-file-pen"></i></a
											>
										{/if}
										<button class="btn btn-danger"><i class="fa-solid fa-trash-alt"></i></button>
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
