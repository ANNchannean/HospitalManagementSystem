<script lang="ts">
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import type { PageServerData } from '../../routes/(dash)/billing/opd/[id]/$types';
	type Data = Pick<PageServerData, 'charge_on_prescription' | 'get_billing' | 'get_currency'>;
	export let data: Data;
	$: ({ charge_on_prescription, get_billing, get_currency } = data);
</script>

<!-- Prescription  -->
{#if charge_on_prescription?.productOrder.length}
	{#each charge_on_prescription.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
				{#each get_billing?.visit?.presrciption || [] as item_1}
					{#if item_1.product_id === item.product_id}
						<span class="badge text-bg-primary">{item_1.product?.generic_name ?? ''}</span>
						<br />
						<span class="badge text-bg-success">{item_1.use}</span>
						<span class="badge text-bg-warning">
							{#if item_1.morning !== 0}
								Morning {item_1.morning}
							{/if}
						</span>
						<span class="badge text-bg-warning">
							{#if item_1.noon !== 0}
								Noon {item_1.noon}
							{/if}
						</span>
						<span class="badge text-bg-warning">
							{#if item_1.afternoon !== 0}
								Afternoon {item_1.afternoon}
							{/if}
						</span>
						<span class="badge text-bg-warning">
							{#if item_1.evening !== 0}
								Evening {item_1.evening}
							{/if}
						</span>
						<span class="badge text-bg-warning">
							{#if item_1.night !== 0}
								Night {item_1.night}
							{/if}
						</span>
					{/if}
				{/each}

				<br />
			</td>
			<td>
				<fieldset>
					<CurrencyInput
						class="input-group input-group-sm"
						name="price"
						amount={item?.price}
						symbol={get_currency?.currency_symbol}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset>
					<input type="hidden" name="product_order_id" value={item.id} />
					<input
						class="form-control form-control-sm"
						type="number"
						min="0"
						step="any"
						name="qty"
						value={item?.qty}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset>
					<input
						class="form-control form-control-sm"
						type="text"
						pattern="[0-9]+%?"
						name="disc"
						value={item?.discount}
					/>
				</fieldset>
			</td>
			<td>
				<Currency class="" amount={item.total} symbol={get_currency?.currency_symbol} />
			</td>
			<td> </td>
		</tr>
	{/each}
{/if}
