<script lang="ts">
	import Currency from '$lib/coms/Currency.svelte';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing' | 'get_currency'>;
	export let data: Data;
	$: ({ get_billing, get_currency } = data);
	$: products = get_billing?.charge.flatMap((e) => e.productOrder);
</script>

<div class="">
	<table class="table table-bordered">
		<thead class="table-active">
			<tr class="text-center">
				<th style="width: 5%;">ល.រ​ <br /> No. </th>
				<th style="width: 50%;">
					ឈ្មេាះទំនិញ <br />
					Name of Goods
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
			<tr class="border-bottom-0">
				<td colspan="4" class="text-end border-0">សរុប </td>
				<td class="border text-center">
					<Currency
						class=""
						amount={get_billing?.sub_total}
						symbol={get_currency?.currency_symbol}
					/>
				</td>
			</tr>
			<tr class="border-0">
				<td colspan="4" class="text-end border-0">បញ្ចុះតម្លៃ </td>
				<td class="border text-center">
					{get_billing?.discount}
				</td>
			</tr>
			<tr class="border-0">
				<td colspan="4" class="text-end border-0">សរុប </td>
				<td class="border text-center">
					<Currency class="" amount={get_billing?.total} symbol={get_currency?.currency_symbol} />
				</td>
			</tr>
		</tbody>
	</table>
</div>
