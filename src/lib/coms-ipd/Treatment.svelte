<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/progress-note/$types';
	import ActivePrescription from '$lib/coms/ActivePrescription.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	type TVisit = Pick<PageServerData, 'visit'>;
	type TCurrency = Pick<PageServerData, 'get_currency'>;
	type VisitProperties = TVisit['visit'] extends undefined ? never : TVisit['visit'];
	type CurrencyProperties = TCurrency['get_currency'] extends undefined
		? never
		: TCurrency['get_currency'];
	export let find_old_visit: VisitProperties;
	export let get_currency: CurrencyProperties;
	$: total_laboratory =
		find_old_visit?.billing?.charge.find((e) => e.charge_on === 'laboratory')?.price || 0;
	$: total_imagerie =
		find_old_visit?.billing?.charge.find((e) => e.charge_on === 'imagerie')?.price || 0;
	$: total_prescription =
		find_old_visit?.billing?.charge.find((e) => e.charge_on === 'prescription')?.price || 0;
</script>

<div>
	{#each find_old_visit?.presrciption || [] as item, index (item.id)}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="fs-6 text-decoration-underline text-primary"
				>{index + 1}
				{item.product?.products ?? ''}
				{item.product?.generic_name ? `, (  ${item.product?.generic_name ?? ''} )` : ''}
			</span>,
			<span>
				ចំនួន {item.amount ?? ''}
				{item.product?.unit?.unit}, រយៈពេល {item.duration ?? ''}
			</span>
			<table class="table">
				<thead>
					<tr>
						<td style="width: 20%;">
							<span class="">{item.use ?? ''}</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width: 55%;">
							<div class="col">
								{#if item.morning !== 0}
									<ActivePrescription
										activePresrciption={item?.activePresrciption.filter(
											(e) => e.active_for === 'morning'
										)}
										active_for="morning"
										prescription_id={item.id}
									>
										{item.morning}
									</ActivePrescription>
								{/if}
								{#if item.noon !== 0}
									<ActivePrescription
										activePresrciption={item?.activePresrciption.filter(
											(e) => e.active_for === 'noon'
										)}
										active_for="noon"
										prescription_id={item.id}
									>
										{item.noon}
									</ActivePrescription>
								{/if}
								{#if item.afternoon !== 0}
									<ActivePrescription
										activePresrciption={item?.activePresrciption.filter(
											(e) => e.active_for === 'afternoon'
										)}
										active_for="afternoon"
										prescription_id={item.id}
									>
										{item.afternoon}
									</ActivePrescription>
								{/if}
								{#if item.evening !== 0}
									<ActivePrescription
										activePresrciption={item?.activePresrciption.filter(
											(e) => e.active_for === 'evening'
										)}
										active_for="evening"
										prescription_id={item.id}
									>
										{item.evening}
									</ActivePrescription>
								{/if}
								{#if item.night !== 0}
									<ActivePrescription
										activePresrciption={item?.activePresrciption.filter(
											(e) => e.active_for === 'night'
										)}
										active_for="night"
										prescription_id={item.id}
									>
										{item.night}
									</ActivePrescription>
								{/if}
							</div>
						</td>
					</tr>
				</thead>
			</table>
			{#if find_old_visit?.adviceTeaching?.description}
				<span>Advice Teaching: {find_old_visit?.adviceTeaching?.description ?? ''}</span>
			{/if}
		</div>
	{/each}
	{#if total_imagerie || total_laboratory || total_prescription}
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<span class="fs-5">invoice Daily</span>
					</div>
					<div class="col text-end">
						<a href="/billing/single/{find_old_visit?.billing?.id}" class="btn btn-warning btn-sm"
							>Daily Payment</a
						>
					</div>
				</div>
			</div>
			<div class="card-body">
				<table class="table">
					<thead>
						{#if total_laboratory}
							<tr>
								<td>Total Laboratory </td>
								<td>:</td>
								<td>
									<Currency amount={total_laboratory} symbol={get_currency?.currency_symbol} />
								</td>
							</tr>
						{/if}
						{#if total_imagerie}
							<tr>
								<td>Total Imagrie </td>
								<td>:</td>
								<td>
									<Currency amount={total_imagerie} symbol={get_currency?.currency_symbol} />
								</td>
							</tr>
						{/if}
						{#if total_prescription}
							<tr>
								<td>Total Treatment </td>
								<td>:</td>
								<td>
									<Currency amount={total_prescription} symbol={get_currency?.currency_symbol} />
								</td>
							</tr>
						{/if}
						<tr class="border text-bg-light">
							<td>Total Daily </td>
							<td>:</td>
							<td>
								<Currency
									amount={total_prescription + total_imagerie + total_laboratory}
									symbol={get_currency?.currency_symbol}
								/>
							</td>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	{/if}
</div>
