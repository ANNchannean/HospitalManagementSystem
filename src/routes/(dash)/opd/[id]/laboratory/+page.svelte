<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_laboratory_group, get_visit, get_currency } = data);
	$: total_laboratory =
		get_visit?.billing?.charge?.find((e) => e.charge_on === 'laboratory')?.price || 0;
	let loading = false;
</script>

<fieldset disabled={get_visit?.billing?.status !== 'checking'}>
	<form
		on:change={(e) => e.currentTarget.requestSubmit()}
		use:enhance={() => {
			loading = true;
			$globalLoading = true;
			return async ({ update }) => {
				await update({ invalidateAll: true, reset: false });
				loading = false;
				$globalLoading = false;
			};
		}}
		action="?/create_laboratory_request"
		method="post"
	>
		{#each get_laboratory_group as item (item.id)}
			<div class="card">
				<div class="card-header fs-5">
					<span>{item.laboratory_group}</span>
				</div>

				<div class="card-body">
					<div class="form-group row">
						{#each item.product as iitem (iitem.id)}
							<div class="col-sm-3 mb-3">
								<div class="form-check">
									<input
										name="product_id"
										class="form-check-input"
										type="checkbox"
										checked={get_visit?.laboratoryRequest.some((e) => e.product_id === iitem.id)}
										id={iitem.id.toString()}
										value={iitem.id}
									/>
									<label for={iitem.id.toString()} class="custom-control-label"
										>{iitem.products}
									</label>
									<Currency symbol={get_currency?.currency_symbol} amount={iitem.price} />
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<br />
		{/each}
	</form>

	<form
		method="post"
		use:enhance={() => {
			loading = true;
			$globalLoading = true;
			return async ({ update }) => {
				await update({ invalidateAll: true, reset: false });
				loading = false;
				$globalLoading = false;
			};
		}}
		action="?/update_total_laboratory"
		class="card-footer row p-2 bg-light sticky-bottom"
	>
		<div class="col text-end">
			<button type="button" class="btn btn-warning">Total Laboratory</button>
		</div>
		<div class="col-auto">
			<CurrencyInput
				name="total_laboratory"
				symbol={get_currency?.currency_symbol}
				amount={total_laboratory}
			/>
		</div>
		<div class="col-auto">
			<SubmitButton {loading} />
		</div>
	</form>
</fieldset>
