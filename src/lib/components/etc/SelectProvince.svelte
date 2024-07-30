<script lang="ts">
	interface Data {
		id: string;
		name_khmer: string;
		name_latin: string;
	}
	export let data: any = [];
	export let name: string = '';
	export let defalutValue: any = '';
	$: items = data.filter((el: Data) => el.name_khmer.toLowerCase().includes(search.toLowerCase()));
	let search: string = '';
	let result: Data = { id: '', name_khmer: '', name_latin: '' };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={() => document.getElementById(name)?.focus()} class="dropdown">
	<span
		style="text-decoration: none;"
		class="form-control"
		role="button"
		data-bs-bs-toggle="dropdown"
		aria-expanded="false"
	>
		{result.name_khmer ? result.name_khmer : defalutValue?.name_khmer || 'Not select'}
	</span>

	<ul class=" dropdown-menu">
		<div class="px-2 pb-2 form-group">
			<input
				autocomplete="off"
				id={name}
				type="search"
				placeholder="search"
				bind:value={search}
				class="form-control form-control-sm"
			/>
		</div>
		<input type="hidden" value={result.id || defalutValue?.id || ''} {name} />

		<div style="height: 60vh;overflow-y: auto;overflow-x: hidden;">
			<button
				type="button"
				class="dropdown-item"
				on:click={() => {
					result.name_khmer = '';
					result.id = '';
					defalutValue.name_khmer = '';
				}}>cancel</button
			>

			{#each items as i}
				<li>
					<button
						type="button"
						on:click={() => {
							result.name_khmer = i.name;
							result.id = i.id;
							defalutValue.name_khmer = '';
						}}
						class:active={result.name_khmer === i.name_khmer ||
							defalutValue?.name_khmer === i.name_khmer}
						class="dropdown-item">{i.name_khmer}</button
					>
				</li>
			{/each}
		</div>
	</ul>
</div>
