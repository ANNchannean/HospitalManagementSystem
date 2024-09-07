<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import { rateFn } from '$lib/helper';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from '../../routes/(dash)/billing/single/[id]/$types';
	type Data = Pick<
		PageServerData,
		| 'charge_on_general'
		| 'charge_on_imagerie'
		| 'charge_on_laboratory'
		| 'charge_on_prescription'
		| 'charge_on_service'
		| 'charge_on_vaccine'
		| 'get_billing'
		| 'get_currency'
	>;
	export let data: Data;
	$: ({
		charge_on_imagerie,
		charge_on_laboratory,
		charge_on_general,
		charge_on_prescription,
		charge_on_service,
		get_billing,
		get_currency,
		charge_on_vaccine
	} = data);
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
			<fieldset disabled={get_billing?.status !== 'process'}>
				<input type="hidden" name="charge_id" value={charge_on_laboratory.id ?? ''} />
				<CurrencyInput
					sm={true}
					name="charge_on_laboratory"
					{get_currency}
					value={rateFn({
						amount: charge_on_laboratory.price || 0,
						get_currency: get_currency,
						rate: get_currency?.dialy_rate || 0
					})}
				/>
			</fieldset>
		</td>
	</tr>
{/if}
<!-- Imagerie  -->
{#if charge_on_imagerie?.productOrder.length}
	{#each charge_on_imagerie.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
				<br />
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
					<CurrencyInput
						sm={true}
						name="price"
						{get_currency}
						value={rateFn({
							amount: item.price || 0,
							get_currency: get_currency,
							rate: get_currency?.dialy_rate || 0
						})}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<Currency class="" among={item.total} {get_currency} />
			</td>
			<td> </td>
		</tr>
	{/each}
{/if}
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
				<fieldset disabled={get_billing?.status !== 'process'}>
					<CurrencyInput
						sm={true}
						name="price"
						{get_currency}
						value={rateFn({
							amount: item.price || 0,
							get_currency: get_currency,
							rate: get_currency?.dialy_rate || 0
						})}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<Currency class="" among={item.total} {get_currency} />
			</td>
			<td> </td>
		</tr>
	{/each}
{/if}
<!-- Service -->
{#if charge_on_service?.productOrder.length}
	{#each charge_on_service.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
				<br />
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
					<CurrencyInput
						sm={true}
						name="price"
						{get_currency}
						value={rateFn({
							amount: item.price || 0,
							get_currency: get_currency,
							rate: get_currency?.dialy_rate || 0
						})}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<Currency class="" among={item.total} {get_currency} />
			</td>
			<td> </td>
		</tr>
	{/each}
{/if}
<!-- Vaccine -->
{#if charge_on_vaccine?.productOrder.length}
	{#each charge_on_vaccine.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
				<br />
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
					<CurrencyInput
						sm={true}
						name="price"
						{get_currency}
						value={rateFn({
							amount: item.price || 0,
							get_currency: get_currency,
							rate: get_currency?.dialy_rate || 0
						})}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<Currency class="" among={item.total || 0} {get_currency} />
			</td>
			<td> </td>
		</tr>
	{/each}
{/if}
<!-- General  -->
{#if charge_on_general?.productOrder.length}
	{#each charge_on_general.productOrder as item (item.id)}
		<tr class="text-center">
			<td class="text-start">
				&nbsp;{item.product?.products}
				<br />
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
					<CurrencyInput
						sm={true}
						name="price"
						{get_currency}
						value={rateFn({
							amount: item.price || 0,
							get_currency: get_currency,
							rate: get_currency?.dialy_rate || 0
						})}
					/>
				</fieldset>
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<fieldset disabled={get_billing?.status !== 'process'}>
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
				<Currency class="" among={item.total || 0} {get_currency} />
			</td>
			<td>
				<fieldset disabled={get_billing?.status !== 'process'}>
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
