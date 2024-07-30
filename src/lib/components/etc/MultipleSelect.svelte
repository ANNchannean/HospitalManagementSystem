<script lang="ts">
	export let items: { name: any; id: any }[];
	export let name = '';
	export let value: any = '';
	export let height = '300';
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
			>{@html items.find((e) => e.id === value)?.name
				? items.find((e) => e.id === value)?.name
				: 'Select'}
		</span>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->

		<span
			on:click={(e) => {
				e.stopPropagation();
				value = '';
			}}
			style="float:right;"
		>
			<i class="fa-solid fa-xmark"></i></span
		>
	</button>

	<div style="width: 100%;" class="dropdown-menu">
		<div class="px-2 pb-2">
			<input id={name} bind:value={q} class="form-control" type="search" />
		</div>

		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a class="text-decoration-none" role="button" href="" on:click>
				{#each data as item}
					<button
						type="button"
						class:active={item.id === items.find((e) => e.id === value)?.id}
						on:click={() => {
							value = item.id;
						}}
						class="dropdown-item">{@html item.name ?? ''}</button
					>
				{/each}
			</a>
		</div>
	</div>
</div>
