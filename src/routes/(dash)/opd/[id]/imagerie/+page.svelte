<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let loading = false;
	$: ({ get_imageerie_groups, get_visit } = data);
	$: total_imagerie = get_visit?.billing?.charge.find((e) => e.charge_on === 'imagerie')?.price;
</script>

<form
	on:change={(e) => e.currentTarget.requestSubmit()}
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update({ reset: false });
			loading = false;
		};
	}}
	action="?/create_imagerie_request"
	method="post"
>
	{#each get_imageerie_groups as item}
		{@const products = item.product}
		<div class="card">
			<div class="card-header">
				<h4 class="">
					<span>{item.imagerie_group}</span>
				</h4>
			</div>
			<div class="form-horizontal">
				<div class="card-body">
					<div class="form-group row">
						{#each products as iitem}
							<div class="col-sm-3 mb-3">
								<div class="form-check">
									<input
										class="form-check-input"
										type="checkbox"
										name="product_id"
										checked={get_visit?.imagerieRequest.some((e) => e.product_id === iitem.id)}
										id={iitem.id.toString()}
										value={iitem.id}
									/>
									<label for={iitem.id.toString()} class="custom-control-label"
										>{iitem.products}</label
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
	<div class="card-footer row bg-light p-2 sticky-bottom">
		<div class="col text-end">
			<button class="btn btn-warning"
				>Total Imagerie {Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(total_imagerie))}
			</button>
		</div>

		<div class="col-auto">
			<SubmitButton {loading} />
		</div>
	</div>
</form>
