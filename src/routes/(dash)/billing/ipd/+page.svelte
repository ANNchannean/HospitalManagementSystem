<script lang="ts">
	import type { PageServerData } from './$types';
	import { inerHight } from '$lib/store';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { _ } from '$lib/translations';
	export let data: PageServerData;
	$: ({ get_billings } = data);
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
					><i class=" fas fa-procedures"></i>
					{$_('ipd')}
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
					<thead class="sticky-top top-0 bg-light table-active">
						<tr class="text-center">
							<th style="width: 5%;">{$_('n')}</th>
							<th style="width: 10%;">{$_('date')}</th>
							<th style="width: 5%;">#</th>
							<th style="width: 10%;">{$_('patient')}</th>
							<th style="width: 10%;">{$_('status')}</th>
							<th style="width: 10%;">{$_('payment')}</th>
						</tr>
					</thead>
					<tbody>
						{#each get_billings as item}
							<tr class="text-center">
								<td>
									{item.id}
								</td>
								<td>
									<DateTimeFormat date={item?.created_at} />
								</td>
								<td>
									{item.progress_note_id}
								</td>
								<td>
									<a target="_blank" href="/opd/{item.id}/subjective">
										<span class="">
											{item?.patient?.name_khmer}
										</span>
										<br />
										<span class="badge text-bg-primary">
											{item?.patient?.name_latin}
										</span>
									</a>
								</td>
								<td>
									{item.status ?? ''}
								</td>
								<td>
									{#if item.billing_type === 'IPD' && item.progressNote?.date_checkout}
										<a target="_blank" class="btn btn-link" href="/billing/ipd/{item.progress_note_id}"
											>{$_('go_to_payment')}</a
										>
									{:else if item.billing_type === 'CHECKING'}
										<a target="_blank" class="btn btn-link" href="/billing/checking/{item.id}"
											>{$_('go_to_payment')}</a
										>
									{:else}
										<a target="_blank" class="btn btn-link" href="/billing/service/{item.id}"
											>{$_('go_to_payment')}</a
										>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
