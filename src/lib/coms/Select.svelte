<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Athtml from '$lib/coms/Athtml.svelte';
	import { globalLoading } from '$lib/store';
	export let items: { name: any; id: any }[];
	export let name = '';
	export let displayName = 'Select';
	export let value: any = '';
	export let height = '300';
	export let action = '';
	export let selectType = 'form' as 'form' | 'submit' | 'param';
	let q = '';
	$: data = items.filter((el) => el.name.toLowerCase().includes(q.toLowerCase()));
	function pushParam(e: string) {
		const newUrl = new URL($page.url);
		newUrl?.searchParams?.set(name, e);
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
	on:click={() => document.getElementById(name)?.focus()}
	class="dropdown form-control m-0 p-0 shadow-none border-0"
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
					: displayName}
			/>
		</span>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if selectType === 'submit'}
			<span
				on:click={(e) => {
					e.stopPropagation();
					value = null;
					document.getElementById('submit_selected')?.click();
				}}
				class="float-end"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{:else if selectType === 'form'}
			<span
				on:click={(e) => {
					e.stopPropagation();
					value = null;
				}}
				class="float-end"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{:else if selectType === 'param'}
			<span
				on:click={(e) => {
					e.stopPropagation();
					value = null;
					pushParam('');
				}}
				class="float-end"
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
			<div class="text-decoration-none">
				{#each data as item}
					{#if selectType === 'submit'}
						<form
							use:enhance={() => {
								$globalLoading = true;
								return async ({ update }) => {
									await update();
									$globalLoading = false;
								};
							}}
							{action}
							method="post"
						>
							<input type="hidden" value={item.id} {name} />

							<button
								type="submit"
								class:active={item.id === items.find((e) => e.id === value)?.id}
								class="dropdown-item"
								on:click={(e) => {
									value = item.id;
								}}
							>
								<Athtml html={item.name} />
							</button>
						</form>
					{:else if selectType === 'form'}
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
					{:else if selectType === 'param'}
						<button
							type="button"
							class:active={item.id === items.find((e) => e.id === value)?.id}
							on:click={(e) => {
								e.preventDefault();
								if (value === item.id) {
									value = null;
									pushParam('');
								} else {
									value = item.id;
									pushParam(item.id);
								}
							}}
							class="dropdown-item"
						>
							<Athtml html={item.name} />
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
{#if selectType === 'submit'}
	<div class="d-none">
		<form
			use:enhance={() => {
				$globalLoading = true;
				return async ({ update }) => {
					await update();
					$globalLoading = false;
				};
			}}
			{action}
			method="post"
		>
			<input type="text" value="" {name} />
			<button id="submit_selected" type="submit">p</button>
		</form>
	</div>
{/if}
