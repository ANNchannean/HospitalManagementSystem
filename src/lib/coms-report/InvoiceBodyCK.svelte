<script lang="ts">
	import Currency from '$lib/coms/Currency.svelte';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing' | 'get_currency' | 'previous_due'>;
	export let data: Data;
	$: ({ get_billing, get_currency, previous_due } = data);
	$: laboratory = get_billing?.charge
		.filter((e) => e.charge_on === 'laboratory')
		.flatMap((e) => e.price);
	$: prescription = get_billing?.charge
		.filter((e) => e.charge_on === 'prescription')
		.flatMap((e) => e.productOrder);
	$: products = get_billing?.charge
		.filter((e) => e.charge_on !== 'laboratory' && e.charge_on !== 'prescription')
		.flatMap((e) => e.productOrder);
	$: total_laboratory = laboratory?.reduce((s, e) => s + e, 0) || 0;
	$: total_prescription = prescription?.reduce((s, e) => s + e.price, 0) || 0;
	$: charge_prescription = get_billing?.charge.find((e) => e.charge_on === 'prescription') || 0;
	$: charge_laboratory = get_billing?.charge.find((e) => e.charge_on === 'laboratory') || 0;
	$: charge_service = get_billing?.charge.find((e) => e.charge_on === 'service') || 0;
	$: charge_bed = get_billing?.charge.find((e) => e.charge_on === 'bed') || 0;
	$: charge_vaccine = get_billing?.charge.find((e) => e.charge_on === 'vaccine') || 0;
	$: charge_general = get_billing?.charge.find((e) => e.charge_on === 'general') || 0;
</script>

<div style="font-size: 110%;" class="">
	<table class="table table-bordered">
		<thead class="table-active">
			<tr class="text-center">
				<th style="width: 5%;">ល.រ​ <br /> No. </th>
				<th style="width: 50%;">
					ឈ្មោះទំនិញ <br />
					Name of Products
				</th>
				<th style="width: 10%;">
					ចំនួន <br />
					Quanity
				</th>
				<th style="width: 15%;">
					តម្លៃរាយ <br />
					Unit Price
				</th>
				<th style="width: 20%;">
					តម្លៃសរុប <br />
					Amount
				</th>
			</tr>
		</thead>
		<tbody>
			{#each products || [] as item, index}
				<tr>
					<td class="text-center">{index + 1}</td>
					<td>
						{item.product.products}
					</td>
					<td class="text-center">{item.qty}</td>
					<td class="text-center">
						<Currency class="" amount={item.price} symbol={get_currency?.currency_symbol} />
					</td>
					<td class="text-center">
						<Currency class="" amount={item.total} symbol={get_currency?.currency_symbol} /></td
					>
				</tr>
			{/each}
			{#if total_prescription > 0}
				{#if get_billing?.progressNote?.date_checkout}
					<tr>
						<td class="text-center">{Number(products?.length) + 1}</td>
						<td colspan="3"> ថ្នាំលេបព្យាបាលនៅផ្ទះ {`( ${prescription?.length} មុខ )`} </td>

						<td class="text-center">
							<Currency
								class=""
								amount={total_prescription}
								symbol={get_currency?.currency_symbol}
							/></td
						>
					</tr>
				{/if}
			{/if}
			{#if total_laboratory > 0}
				<tr>
					<td class="text-center">{Number(products?.length) + 2}</td>
					<td colspan="3">
						ពិនិត្យឈាម​​ {`( ធ្វើតេស្តមន្ទីរពិសោធន៍ ${laboratory?.length} មុខ )`}
					</td>

					<td class="text-center">
						<Currency
							class=""
							amount={total_laboratory}
							symbol={get_currency?.currency_symbol}
						/></td
					>
				</tr>
			{/if}
			<tr class="border-bottom-0">
				<th colspan="4" class="text-end border-0"
					>សរុប / Total {`(${get_currency?.currency_symbol})`}
				</th>
				<th class="border text-center">
					<Currency
						class=""
						amount={get_billing?.sub_total}
						symbol={get_currency?.currency_symbol}
					/>
				</th>
			</tr>
			<tr class="border-0">
				<th colspan="4" class="text-end border-0">
					សរុប / Total {`(${get_currency?.exchang_to})`}
				</th>
				<th class="border text-center">
					<Currency
						class=""
						rate_to={get_currency?.exchang_rate}
						rate={get_currency?.currency_rate}
						amount={get_billing?.sub_total}
						symbol={get_currency?.exchang_to}
					/>
				</th>
			</tr>
			{#if get_billing?.discount.includes('%') || Number(get_billing?.discount) > 0}
				<tr class="border-0">
					<th colspan="4" class="text-end border-0"> បញ្ចុះតម្លៃ / Discount </th>
					<th class="border text-center">
						{#if get_billing?.discount.includes('%')}
							{get_billing?.discount}
						{:else}
							<Currency
								class=""
								amount={Number(get_billing?.discount)}
								symbol={get_currency?.currency_symbol}
							/>
						{/if}
					</th>
				</tr>
			{/if}

			{#if Number(get_billing?.tax) > 0}
				<tr class="border-0">
					<th colspan="4" class="text-end border-0">ពន្ធ​ / Tax </th>
					<th class="border text-center">
						<Currency
							class=""
							amount={Number(get_billing?.tax)}
							symbol={get_currency?.currency_symbol}
						/>
					</th>
				</tr>
			{/if}

			<tr class="border-0">
				<th colspan="4" class="text-end border-0">សរុបចុងក្រោយ / Grand Total </th>
				<th class="border text-center">
					<Currency class="" amount={get_billing?.total} symbol={get_currency?.currency_symbol} />
				</th>
			</tr>
			<tr class="border-0">
				<th colspan="4" class="text-end border-0">បានបង់ប្រាក់ / Paid Amount </th>
				<th class="border text-center">
					<Currency class="" amount={get_billing?.paid} symbol={get_currency?.currency_symbol} />
				</th>
			</tr>
			{#if Number(get_billing?.balance) > 0}
				<tr class="border-0">
					<th colspan="4" class="text-end border-0">ប្រាក់ជំពាក់ / Due </th>
					<th class="border text-center">
						<Currency
							class=""
							amount={get_billing?.balance}
							symbol={get_currency?.currency_symbol}
						/>
					</th>
				</tr>
			{/if}
			{#if previous_due > 0}
				<tr class="border-0">
					<th colspan="4" class="text-end border-0">ប្រាក់ជំពាក់លើកមុន / Previous Due </th>
					<th class="border text-center">
						<Currency class="" amount={previous_due} symbol={get_currency?.currency_symbol} />
					</th>
				</tr>
			{/if}
			{#if previous_due + Number(get_billing?.balance) > 0}
				<tr class="border-0">
					<th colspan="4" class="text-end border-0">ប្រាក់ជំពាក់សរុប / Total Due </th>
					<th class="border text-center">
						<Currency
							class=""
							amount={previous_due + Number(get_billing?.balance)}
							symbol={get_currency?.currency_symbol}
						/>
					</th>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
