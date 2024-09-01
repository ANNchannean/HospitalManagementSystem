<script lang="ts">
	import Select from '$lib/coms/Select.svelte';
	export let units: Unit[];
	export let unit_id: number;
	export let main_unit_id: number | null | undefined;
	interface Unit {
		id: number;
		unit: string | null;
		vaccine_dose: string | null;
		product_group_type_id: number | null;
	}
	export let qty = 0;
	export let price = 0;
	$: find_unit = units.find((e) => e.id === unit_id);
	$: find_main_unit = units.find((e) => e.id === main_unit_id);
</script>

<div class="row">
	<div class="col-4">
		<div class="form-group pb-3">
			<label for="unit_id_per_unit">Unit / {find_unit?.unit ?? ''}</label>
			<div class="input-group">
				<Select
					bind:value={unit_id}
					name="unit_id_per_unit"
					items={units.map((e) => ({ id: e.id, name: e.unit }))}
				/>
			</div>
		</div>
	</div>
	<div class="col-4">
		<div class="form-group pb-3">
			<label for="price_per_unit">Price / {find_unit?.unit ?? ''} </label>
			<input
				value={price}
				name="price_per_unit"
				type="text"
				class="form-control"
				id="price_per_unit"
			/>
		</div>
	</div>
	<div class="col-4">
		<div class="form-group pb-3">
			<label for="qty_per_unit">Qty / {find_unit?.unit ?? ''} / {find_main_unit?.unit} </label>
			<div class="input-group">
				<input
					class="form-control"
					value={qty}
					name="qty_per_unit"
					type="number"
					id="qty_per_unit"
				/>
			</div>
		</div>
	</div>
</div>
