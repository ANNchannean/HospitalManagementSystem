<script lang="ts">
	import { enhance } from '$app/forms';
	import Athtml from '$lib/coms/Athtml.svelte';
	import { globalLoading } from '$lib/store';
	export let items: { name: any; id: any }[];
	export let name = '';
	export let value: any = '';
	export let height = '300';
	export let useSubmit = false;
	let q = '';
	$: data = items.filter((el) => el.name.toLowerCase().includes(q.toLowerCase()));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => document.getElementById(name)?.focus()}
	class=" dropdown form-control m-0 p-0 shadow-none border-0"
>
	<input {value} type="hidden" {name} />
	<button
		type="button"
		on:click={() => (q = '')}
		class="form-control"
		data-bs-toggle="dropdown"
		aria-expanded="false"
	>
		<span style="float:left;"
			><Athtml
				html={items.find((e) => e.id === value)?.name
					? items.find((e) => e.id === value)?.name
					: 'Select'}
			/>
		</span>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if useSubmit}
			<span
				on:click={(e) => {
					e.stopPropagation();
					value = null;
				}}
				style="float:right;"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{:else}
			<span
				on:click={(e) => {
					e.stopPropagation();
					value = null;
				}}
				style="float:right;"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{/if}
	</button>

	<div style="width: 100%;" class="dropdown-menu">
		<div class="px-2 pb-2">
			<input id={name} bind:value={q} class="form-control" type="search" />
		</div>

		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<span class="text-decoration-none">
				{#each data as item}
					{#if useSubmit}
						<button
							type="submit"
							class:active={item.id === items.find((e) => e.id === value)?.id}
							class="dropdown-item"
							on:click={() => {
								if (value === item.id) {
									value = null;
								} else {
									value = item.id;
								}
							}}
						>
							<Athtml html={item.name} />
						</button>
					{:else}
						<button
							type="button"
							class:active={item.id === items.find((e) => e.id === value)?.id}
							on:click={(e) => {
								e.preventDefault();
								if (value === item.id) {
									value = null;
								} else {
									value = item.id;
								}
							}}
							class="dropdown-item"
						>
							<Athtml html={item.name} />
						</button>
					{/if}
				{/each}
			</span>
		</div>
	</div>
</div>
