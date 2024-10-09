<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from '../../routes/(dash)/billing/checking/[id]/$types';
	type Data = Pick<PageServerData, 'charge_on_bed' | 'get_currency'>;
	export let data: Data;
	$: ({ charge_on_bed, get_currency } = data);
</script>

<!-- Bed  -->
{#if charge_on_bed?.productOrder.length}
	{#each charge_on_bed.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
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
				<Currency class="" amount={item.total || 0} symbol={get_currency?.currency_symbol} />
			</td>
			<td>
				<fieldset>
					<form
						action="?/remove_product_order"
						use:enhance={() => {
							$globalLoading = true;
							return async ({ update }) => {
								await update();
								$globalLoading = false;
							};
						}}
						method="post"
					>
						<input type="hidden" name="product_order_id" value={item.id} />
						<button type="submit" class="btn btn-link text-danger"
							><i class="fa-solid fa-trash"></i></button
						>
					</form>
				</fieldset>
			</td>
		</tr>
	{/each}
{/if}
