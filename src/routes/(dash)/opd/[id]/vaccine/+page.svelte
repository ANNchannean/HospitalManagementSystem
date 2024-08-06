<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_vaccine_group, get_visit } = data);
	$: total_vaccine_service = get_visit?.billing?.charge.find(
		(e) => e.charge_on === 'vaccine'
	)?.price;
	let loading = false;
</script>

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
	<fieldset disabled={get_visit?.billing?.status !== 'active'}>
		<div class="card">
			<div class="card-header fs-5">
				<span>Vaccine</span>
			</div>
			<div class="card-body">
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
								<span class="badge text-bg-danger"
									>{new Intl.NumberFormat('en-US', {
										currency: 'USD',
										style: 'currency'
									}).format(item.price)}</span
								>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<br />

		<div class="card-footer row p-2 bg-light sticky-bottom">
			<div class="col text-end">
				<button class="btn btn-warning"
					>Total Imagerie {Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(Number(total_vaccine_service))}
				</button>
			</div>
			<div class="col-auto">
				<SubmitButton />
			</div>
		</div>
	</fieldset>
</form>
