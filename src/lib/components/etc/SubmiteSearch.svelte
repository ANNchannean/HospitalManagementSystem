<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { globalLoading } from '$lib/store';
	export let items: { name: any; id: any; price: any }[];
	export let height = '300';
	export let placeholder = '';
	let q = '';
	$: qq = $page.url.searchParams.get('q');
	$: data = items.filter((el) => el.name.toLowerCase().includes(q.toLowerCase()));
	$: {
		if (browser) {
			if (data.length === 1 && !qq) {
				document.getElementById('submit')?.click();
			}
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	on:click={(e) => {
		e.stopPropagation();
	}}
	class="dropdown form-control m-0 p-0 shadow-none border-0"
>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		{placeholder}
		name="q"
		autocomplete="off"
		data-bs-toggle="dropdown"
		id="dropdown"
		bind:value={q}
		class="form-control"
		type="text"
		data-bs-auto-close="outsite"
	/>
	<ul style="width: 100%;" class="dropdown-menu">
		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y-invalid-attribute -->
			{#each data as item (item.id)}
				<!-- svelte-ignore a11y-autofocus -->
				<form
					autofocus
					method="post"
					use:enhance={() => {
						$globalLoading = true;
						return async ({ update }) => {
							q = '';
							await update();
							$globalLoading = false;
							document.getElementById('dropdown')?.focus();
						};
					}}
					action="?/create_product_order"
				>
					<li>
						<input type="hidden" value={item.id ?? ''} name="product_id" />
						<input type="hidden" value={item.price ?? ''} name="price" />
						<button id="submit" type="submit" class="dropdown-item">{item.name ?? ''}</button>
					</li>
				</form>
			{/each}
		</div>
	</ul>
</div>
