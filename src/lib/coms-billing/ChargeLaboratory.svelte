<script lang="ts">
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import type { PageServerData } from '../../routes/(dash)/billing/opd/[id]/$types';
	type Data = Pick<PageServerData, 'charge_on_laboratory' | 'get_currency'>;
	export let data: Data;
	$: ({ charge_on_laboratory, get_currency } = data);
</script>

<!-- Laboratory  -->
{#if charge_on_laboratory?.productOrder.length}
	<tr class="text-center">
		<td colspan="4" class="text-start">
			{#each charge_on_laboratory.productOrder as item (item.id)}
				<span>
					&nbsp;{item.product?.products}
				</span> <br />
			{/each}
		</td>
		<td>
			<fieldset>
				<input type="hidden" name="charge_id" value={charge_on_laboratory.id ?? ''} />
				<CurrencyInput
					class="input-group input-group-sm"
					name="charge_on_laboratory"
					amount={charge_on_laboratory.price}
					symbol={get_currency?.currency_symbol}
				/>
			</fieldset>
		</td>
	</tr>
{/if}
