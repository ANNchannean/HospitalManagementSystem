<script lang="ts">
	import { goto } from '$app/navigation';
	import { page as page_ } from '$app/stores';
	export let page: number;
	export let limit: number = 10;
	export let items: number;
	$: total_page = Math.ceil(items / limit);
	function pushPage() {
		if (page < 1 || page > total_page) {
			page = 1;
		}
		const newUrl = new URL($page_.url);
		newUrl?.searchParams?.set('page', page.toString());
		newUrl?.searchParams?.set('limit', limit.toString());
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
</script>

<div class="row">
	<div class="col-6 d-flex">
		<div class="align-content-center">
			<span>Items Per Page </span>
		</div>
		<div class="align-content-center mx-2">
			<select
				on:change={(e) => {
					limit = Number(e.currentTarget.value);
					pushPage();
				}}
				class="form-control form-control-sm px-4"
				name="limit"
				id="limit"
			>
				<option selected value="10">10</option>
				<option value="15">15</option>
				<option value="25">25</option>
				<option value="35">35</option>
				<option value="50">50</option>
				<option value="100">100</option>
				<option value="200">200</option>
				<option value={items}>All</option>
			</select>
		</div>
		<div class="align-content-center">
			<span> {items} Items</span>
		</div>
	</div>

	<div class="col-6 d-flex justify-content-end">
		<div class="">
			<button
				on:click={() => {
					page = page - 2;
					pushPage();
				}}
				class="btn btn-light btn-sm align-items-center"
				><i class="fa-solid fa-angles-left"></i></button
			>
			<button
				on:click={() => {
					page = page - 1;
					pushPage();
				}}
				class="btn btn-light btn-sm align-items-center"
				><i class="fa-solid fa-angle-left"></i></button
			>
		</div>

		<div class="mx-2">
			<input
				on:input={(e) => {
					page = Number(e.currentTarget.value);
					pushPage();
				}}
				value={page}
				style="width: 70px;"
				type="number"
				class="form-control form-control-sm text-center"
			/>
		</div>
		<div class="align-content-center">
			<span>of / {total_page} Pages </span>
		</div>
		<div class="">
			<button
				on:click={() => {
					page = page + 1;
					pushPage();
				}}
				class="btn btn-light btn-sm"><i class="fa-solid fa-angle-right"></i></button
			>
			<button
				on:click={() => {
					page = page + 2;
					pushPage();
				}}
				class="btn btn-light btn-sm"><i class="fa-solid fa-angles-right"></i></button
			>
		</div>
	</div>
</div>
