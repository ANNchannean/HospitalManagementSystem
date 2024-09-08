<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData, ActionData } from './$types';
	import { inerHight } from '$lib/store';
	import ViewPayBilling from '$lib/coms/ViewPayBilling.svelte';
	import AddPayBilling from '$lib/coms/AddPayBilling.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_billings, get_currency } = data);
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
	$: value = get_billings?.find((e) => e.id === billing_id)?.balance || 0;
</script>

<ViewPayBilling {data} {billing_id} />
<AddPayBilling {value} {data} {form} {billing_id} />

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
				<!-- <h3 class="card-title">Fixed Header Table</h3> -->
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered table-hover">
					<thead class="position-sticky top-0 bg-light table-active">
						<tr class="text-center">
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
						{#each get_billings as item}
							<tr class="text-center">
								<td>
									{item.id}
								</td>

								<td>
									<DateTimeFormat timeStyle={false} date={item.visit?.date_checkup} /> <br />
									<DateTimeFormat dateStyle={false} date={item.visit?.date_checkup} />
								</td>
								<td>{item.visit?.checkin_type ?? ''}</td>
								<td>
									<span class="">
										{item.visit?.patient?.name_khmer}
									</span>
									<br />
									<span class="">
										{item.visit?.patient?.name_latin}
									</span>
								</td>
								<td>{item.visit?.patient?.gender ?? ''}</td>
								<td>{item.visit?.patient?.age ?? ''}</td>
								<td>{item.visit?.patient?.telephone ?? ''}</td>
								<td></td>
								<td>
									<Currency class="" amount={item.sub_total} symbol={get_currency?.currency_symbol} />
								</td>

								<td>
									{#if item.discount.includes('%')}
										{item.discount}
									{:else if Number(item.discount) > 0}
										<Currency class="" amount={+item.discount} symbol={get_currency?.currency_symbol} />
									{/if}
								</td>
								<td>
									<Currency class="" amount={+item.total} symbol={get_currency?.currency_symbol} />
								</td>
								<td>{item.tax}</td>
								<td>
									<Currency class="" amount={item.total_after_tax} symbol={get_currency?.currency_symbol} />
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
										<button class="btn btn-success"><i class="fa-solid fa-file"></i></button>

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

										<a href="/billing/single/{billing_id}" class="btn btn-primary"
											><i class="fa-solid fa-file-pen"></i></a
										>
										<button class="btn btn-danger"><i class="fa-solid fa-trash-alt"></i></button>
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
