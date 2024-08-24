<script lang="ts">
	import { goto } from '$app/navigation';
	import Athtml from '$lib/coms/Athtml.svelte';
	export let items: { name: any; id: any }[];
	export let height = '300';
	export let mainParams = '';
	export let chailParams = '';
	export let value: any;
	let q = '';
	$: data = items.filter((el) => el.name.toLowerCase().includes(q.toLowerCase()));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => document.getElementById(mainParams)?.focus()}
	class=" dropdown form-control m-0 p-0 shadow-none border-0"
>
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

		<span
			on:click={() => {
				value = '';
				goto(`${mainParams}=${chailParams}`, { keepFocus: true, noScroll: true });
			}}
			style="float:right;"
		>
			<i class="fa-solid fa-xmark"></i></span
		>
	</button>

	<div style="width: 100%;" class="dropdown-menu">
		<div class="px-2 pb-2">
			<input id={mainParams} bind:value={q} class="form-control" type="search" />
		</div>

		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			{#each data as item}
				<button
					type="button"
					class:active={item.id === items.find((e) => e.id === value)?.id}
					on:click={() => {
						value = item.id;
						goto(`${mainParams}=${item.id}${chailParams}`, { keepFocus: true, noScroll: true });
					}}
					class="dropdown-item"><Athtml html={item.name ?? ''} /></button
				>
			{/each}
		</div>
	</div>
</div>
