<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_vaccine_group, get_visit, get_currency } = data);
	$: total_vaccine_service =
		data.get_visit?.billing?.charge.find((e) => e.charge_on === 'vaccine')?.price || 0;
	let loading = false;
</script>

<fieldset disabled={get_visit?.billing?.status !== 'active'}>
	<div class="card">
		<div class="card-header fs-5">
			<span>Vaccine</span>
		</div>
		<div class="card-body">
			<form
				on:change={(e) => e.currentTarget.requestSubmit()}
				use:enhance={() => {
					loading = true;
					$globalLoading = true;
					return async ({ update }) => {
						await update({ reset: false });
						loading = false;
						$globalLoading = false;
					};
				}}
				action="?/vaccine_service"
				method="post"
			>
				<div class="form-group row">
					{#each get_vaccine_group?.product || [] as item (item.id)}
						<div class="col-sm-3 mb-3">
							<div class="form-check">
								<input
									name="product_id"
									class="form-check-input"
									type="checkbox"
									checked={get_visit?.vaccine.some((e) => e.product_id === item.id)}
									id={item.id.toString()}
									value={item.id}
								/>
								<label for={item.id.toString()} class="custom-control-label"
									>{item.products}
								</label>
								<Currency amount={item.price} symbol={get_currency?.currency_symbol} />
							</div>
						</div>
					{/each}
				</div>
			</form>
		</div>
	</div>
	<br />

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
		action="?/update_total_vaccine"
		class="card-footer row p-2 bg-light sticky-bottom"
	>
		<div class="col text-end">
			<button type="button" class="btn btn-warning">Total Vaccine</button>
		</div>
		<div class="col-auto">
			<CurrencyInput
				name="total_vaccine"
				symbol={get_currency?.currency_symbol}
				amount={total_vaccine_service}
			/>
		</div>
		<div class="col-auto">
			<SubmitButton {loading} />
		</div>
	</form>
</fieldset>
