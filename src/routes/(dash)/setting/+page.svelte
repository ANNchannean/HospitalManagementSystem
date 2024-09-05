<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_currency } = data);
	let price = 22.22;
	let conerting: string;
	$: {
		if (get_currency?.symbol === get_currency?.from_symbol) {
			conerting = Intl.NumberFormat('en-US')
				.format(Math.ceil(price * Number(get_currency?.rate_from)) / Number(get_currency?.rate_to))
				.concat(` ${get_currency?.from_symbol}`);
		} else {
			conerting = Intl.NumberFormat('en-US').format(price).concat(` ${get_currency?.to_symbol}`);
		}
	}
	let loading = false;
	let show_toas = false;
	let from_symbol = data.get_currency?.from_symbol ?? '';
	let to_symbol = data.get_currency?.to_symbol ?? '';
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

<div class="col">
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
		action="?/create_currency"
	>
		<input value={get_currency?.id ?? ''} type="hidden" name="currency_id" />
		<div class="row">
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="symbol">Symbol</label>
				<input
					value={get_currency?.symbol ?? ''}
					class="form-control"
					type="text"
					name="symbol"
					id="symbol"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="from_symbol">From Symbol</label>
				<input
					bind:value={from_symbol}
					class="form-control"
					type="text"
					name="from_symbol"
					id="from_symbol"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="to_symbol">To Symbol</label>
				<input
					disabled
					bind:value={to_symbol}
					class="form-control"
					type="text"
					name="to_symbol"
					id="to_symbol"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="from">From {from_symbol} </label>
				<input
					value={get_currency?.rate_from ?? ''}
					class="form-control"
					type="text"
					name="rate_from"
					id="from"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="rate_to">To {to_symbol}</label>
				<input
					value={get_currency?.rate_to ?? ''}
					class="form-control"
					type="text"
					name="rate_to"
					id="rate_to"
				/>
			</div>
			<div class="col-sm-4 pb-2">
				<label class="form-label" for="dialy_rate">Dialy rate {from_symbol}</label>
				<input
					value={get_currency?.dialy_rate ?? ''}
					class="form-control"
					type="text"
					name="dialy_rate"
					id="dialy_rate"
				/>
			</div>
		</div>

		<div class="text-end pt-2">
			<SubmitButton {loading} />
		</div>
	</form>
</div>
