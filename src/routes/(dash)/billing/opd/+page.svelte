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
					><i class="fas fa-stethoscope"></i>
					{$_('opd')}
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
									<DateTimeFormat date={item.visit?.date_checkup} />
								</td>
								<td>
									{item.visit?.patient_id}
								</td>
								<td>
									<a href="/opd/{item.id}/subjective">
										<span class="">
											{item.visit?.patient?.name_khmer}
										</span>
										<br />
										<span class="badge text-bg-primary">
											{item.visit?.patient?.name_latin}
										</span>
									</a>
								</td>

								<td>
									{item.status ?? ''}
								</td>
								<td>
									<a class="btn btn-link" href="/billing/opd/{item.id}">{$_('go_to_payment')}</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
