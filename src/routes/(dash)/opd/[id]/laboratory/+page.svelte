<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_laboratory_group, get_visit } = data);
	$: total_laboratory = get_visit?.billing?.charge.find((e) => e.charge_on === 'laboratory')?.price;

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
	action="?/create_laboratory_request"
	method="post"
>
	<fieldset disabled={get_visit?.billing?.status !== 'active'}>
		{#each get_laboratory_group as item (item.id)}
			<div class="card">
				<div class="card-header fs-5">
					<span>{item.laboratory_group}</span>
				</div>
				<div class="form-horizontal">
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
										<span class="badge text-bg-danger"
											>{new Intl.NumberFormat('en-US', {
												currency: 'USD',
												style: 'currency'
											}).format(iitem.price)}</span
										>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<br />
		{/each}

		<div class="card-footer row p-2 bg-light sticky-bottom">
			<div class="col text-end">
				<button type="button" class="btn btn-warning">Total Laboratory</button>
			</div>
			<div class="col-auto">
				<input
					step="any"
					value={total_laboratory}
					class="form-control"
					type="number"
					name="total_laboratory"
					id="total_laboratory"
				/>
			</div>
			<div class="col-auto">
				<button
					disabled={loading}
					type="submit"
					formaction="?/update_total_laboratory"
					class="btn btn-success">Save</button
				>
			</div>
		</div>
	</fieldset>
</form>
