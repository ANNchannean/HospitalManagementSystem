<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData } from './$types';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	$: ({ get_billings } = data);

	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
</script>

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
				<table class="table table-hover">
					<thead class="position-sticky top-0 bg-light table-active">
						<tr class="text-center">
							<th>ID</th>
							<th>Date</th>
							<th>Patient</th>
							<th>Contact</th>
							<th>Age</th>
							<th>Address</th>
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

								<td
									>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
										.format(new Date(item.visit?.date_checkup ?? ''))
										.split('/')
										.join('-')} <br />
									{new Intl.DateTimeFormat('en-GB', {
										timeStyle: 'short',
										hour12: true
									}).format(new Date(item.visit?.date_checkup ?? ''))}
								</td>

								<td>
									<span class="">
										{item.visit?.patient?.name_khmer}
									</span>
									<br />
									<span class="">
										{item.visit?.patient?.name_latin}
									</span>
								</td>
								<td>{item.visit?.patient?.telephone ?? ''}</td>
								<td>{item.visit?.patient?.age ?? ''}</td>
								<td>
									{item.visit?.patient?.village?.type ?? ''}
									{item.visit?.patient?.village?.name_khmer.concat(',') ?? ''}
									{item.visit?.patient?.commune?.type ?? ''}
									{item.visit?.patient?.commune?.name_khmer.concat(',') ?? ''}
									{item.visit?.patient?.district?.type ?? ''}
									{item.visit?.patient?.district?.name_khmer.concat(',') ?? ''}
									{item.visit?.patient?.provice?.type ?? ''}
									{item.visit?.patient?.provice?.name_khmer ?? ''}
								</td>
								<td></td>
								<td
									>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
										item.sub_total
									)}</td
								>
								<td>
									{#if item.discount.includes('%')}
										{item.discount}
									{:else if Number(item.discount) > 0}
										{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
											Number(item.discount)
										)}
									{/if}
								</td>
								<td
									>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
										item.total
									)}</td
								>
								<td>{item.tax}</td>
								<td
									>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
										item.total_after_tax
									)}</td
								>
								<td
									>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
										item.paid
									)}</td
								>
								<td
									>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
										item.balance
									)}</td
								>
								<td>
									{#if item.status === 'paid'}
										<span class="badge text-bg-success">{item.status ?? ''}</span>
									{:else if item.status === 'partial'}
										<span class="badge text-bg-warning">{item.status ?? ''}</span>
									{:else if item.status === 'due'}
										<span class="badge text-bg-danger">{item.status ?? ''}</span>
									{/if}
								</td>
								<td></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
