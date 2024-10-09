<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Currency from '$lib/coms/Currency.svelte';
	import SelectRef from '$lib/coms/SelectRef.svelte';
	import { globalLoading } from '$lib/store';
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData } from '../../routes/(dash)/billing/opd/[id]/$types';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	type Data = Pick<PageServerData, 'get_product_group_type' | 'get_products' | 'get_currency'>;
	export let data: Data;
	$: ({ get_product_group_type, get_products, get_currency } = data);
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	let product_group_id: number;
	let inerHight: string;
	export let inerHight_1: string;
	onMount(() => {
		if (browser) {
			inerHight = (window.innerHeight - (window.innerHeight * 21) / 100).toString().concat('px');
			inerHight_1 = (window.innerHeight - (window.innerHeight * 47) / 100).toString().concat('px');
			if (window.innerWidth > 990) {
				localStorage.setItem('sb|sidebar-toggle', 'true');
				const sidebarToggle = localStorage.getItem('sb|sidebar-toggle');
				if (sidebarToggle !== 'false') {
					document.getElementById('sidebarToggle')?.click();
				}
			}
		}
	});
	onDestroy(() => {
		if (browser) {
			if (window.innerWidth > 990) {
				const sidebarToggle = localStorage.getItem('sb|sidebar-toggle');
				if (sidebarToggle !== 'true') {
					document.getElementById('sidebarToggle')?.click();
				}
			}
		}
	});
</script>

<div class="card bg-light">
	<form
		on:change={(e) => e.currentTarget.requestSubmit()}
		data-sveltekit-keepfocus
		class="card-header"
	>
		<div class="row">
			<div class="col-md-6">
				<div class="row">
					<div class="col">
						<SelectRef
							mainParams="?group_type_id"
							chailParams={`&${$page.url.searchParams.get('q') || ''}`}
							bind:value={product_group_id}
							items={get_product_group_type.map((e) => ({ id: e.id, name: e.group_type }))}
						/>
					</div>
				</div>
			</div>

			<div class="col-md-6">
				<input type="hidden" name="billing_id" value={$page.url.searchParams.get('billing_id')} />
				<input
					on:input={handleQ}
					name="q"
					type="search"
					class="form-control"
					placeholder="Filter Products"
					aria-label="Filter Products"
					aria-describedby="Filter Products"
				/>
			</div>
		</div>
	</form>

	<div style="height: {inerHight};" class=" overflow-auto justify-content-start">
		{#each get_products as item}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<form
				on:click={(e) => e.currentTarget.requestSubmit()}
				style="min-height: 200px;"
				method="post"
				use:enhance={() => {
					$globalLoading = true;
					return async ({ update }) => {
						await update();
						$globalLoading = false;
					};
				}}
				action="?/create_product_order"
				class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 border m-2 p-2 btn btn-light"
			>
				<input type="hidden" name="product_id" value={item.id} />
				<input type="hidden" name="price" value={item.price} />
				<button type="button" class="position-relative text-wrap btn m-0 p-0">
					{#if item.fileOrPicture?.filename}
						<img class="img-thumbnail" src="/files/{item.fileOrPicture.filename}" alt="" />
					{:else}
						<img class="img-thumbnail" src="/no-image.jpg" alt="" />
					{/if}
					<span class="position-absolute start-50 translate-middle badge rounded-pill bg-danger">
						<Currency class="" amount={item.price} symbol={get_currency?.currency_symbol} />
					</span>
				</button>
				<span class="fs-6 text-wrap">{item.products}</span>
			</form>
		{/each}
	</div>
</div>
