<script lang="ts">
	import { enhance } from '$app/forms';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_currency } = data);
	let loading = false;
	let show_toas = false;
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
<CurrencyInput amount={20000.22} symbol={get_currency?.currency_symbol} />
<div class="card">
	<div class="card-header">
		<span class="fs-5">#Currency</span>
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
		class="card-body"
		action="?/create_currency"
	>
		<input value={get_currency?.id ?? ''} type="hidden" name="currency_id" />
		<div class="row">
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="currency_symbol">Currency Symbol</label>
				<input
					value={get_currency?.currency_symbol ?? ''}
					class="form-control"
					type="text"
					name="currency_symbol"
					id="currency_symbol"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="currency">Currency</label>
				<input
					value={get_currency?.currency ?? ''}
					class="form-control"
					type="text"
					name="currency"
					id="currency"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="currency_rate">Currency Rate</label>
				<input
					value={get_currency?.currency_rate ?? ''}
					class="form-control"
					type="text"
					name="currency_rate"
					id="currency_rate"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="exchang_to">Exchang To</label>
				<input
					value={get_currency?.exchang_to ?? ''}
					class="form-control"
					type="text"
					name="exchang_to"
					id="exchang_to"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="exchang_rate">Exchang Rate</label>
				<input
					value={get_currency?.exchang_rate ?? ''}
					class="form-control"
					type="text"
					name="exchang_rate"
					id="exchang_rate"
				/>
			</div>
		</div>

		<div class="text-end pt-2">
			<SubmitButton {loading} />
		</div>
	</form>
</div>
