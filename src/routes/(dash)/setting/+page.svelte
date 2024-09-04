<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_setting } = data);
	let price = 22.22;
	let conerting: number;
	$: {
		conerting = price * Number(get_setting?.rate_from);
	}
	let loading = false;
	let show_toas = false;
	let value: string;
</script>

<Toast bind:show={show_toas} toas="success" message="រក្សាទុក្ខបានជោគជ័យ!" />

<div class="row">
	<div class="col-sm-6">
		<h2>Setting</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/setting" class="btn btn-link p-0 text-secondary">
					<i class="fa-solid fa-gear"></i>
					Setting
				</a>
			</li>
		</ol>
	</div>
</div>
<span class="fs-3">
	# {conerting.toFixed(2).concat(' ' + get_setting?.currency_symbol)}
</span>
<div class="">
	<div class="form-floating pb-3">
		<input id="value" placeholder="Real" type="number" name="" class="form-control" bind:value />
		<label for="Real">Value</label>
	</div>

	<form
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update({ reset: false });
				loading = false;
				if (result.type !== 'failure') {
					show_toas = true;
				}
			};
		}}
		class="alert alert-secondary"
		action="?/update_setting"
	>
		<input value={get_setting?.id} type="hidden" name="setting_id" />
		<div class="row">
			<div class="col-12">
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						id="currency_symbol"
						name="currency_symbol"
						value={get_setting?.currency_symbol ?? ''}
						placeholder="CurrencySymbol"
					/>
					<label for="currency_symbol">CurrencySymbol</label>
				</div>
			</div>
			<div class="col-6">
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						id="currency_from"
						name="currency_from"
						value={get_setting?.currency_from ?? ''}
						placeholder="Currency From"
					/>
					<label for="currency_from">Currency From</label>
				</div>
			</div>
			<div class="col-6">
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						name="rate_from"
						id="rate_from"
						value={get_setting?.rate_from ?? ''}
						placeholder="Currency Rate From"
					/>
					<label for="rate_from">Currency Rate From</label>
				</div>
			</div>
			<div class="col-6">
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						id="currency_to"
						name="currency_to"
						value={get_setting?.currency_to ?? ''}
						placeholder="Currency To"
					/>
					<label for="currency_to">Currency To</label>
				</div>
			</div>
			<div class="col-6">
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						name="rate_to"
						id="rate_to"
						value={get_setting?.rate_to ?? ''}
						placeholder="Currency Rate To"
					/>
					<label for="rate_to">Currency Rate To</label>
				</div>
			</div>
		</div>

		<div class="text-end pt-2">
			<SubmitButton {loading} />
		</div>
	</form>
</div>
