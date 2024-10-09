<script lang="ts">
	import { enhance } from '$app/forms';
	import Currency from '$lib/coms/Currency.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from '../../routes/(dash)/billing/opd/[id]/$types';
	type Data = Pick<PageServerData, 'get_billing' | 'get_payment_types' | 'get_currency'>;
	export let data: Data;
	$: ({ get_billing, get_payment_types, get_currency } = data);
	let loading = false;
	let disc = '';
	$: after_disc = disc.includes('%')
		? Number(get_billing?.sub_total) -
			(Number(get_billing?.sub_total) * Number(disc.replace('%', ''))) / 100
		: Number(get_billing?.sub_total) - Number(disc);

	let bank_pay = 0;
	let bank_pay_exhange = 0;
	$: default_cash_pay =
		after_disc - (total_bank_pay + cash_pay_exhange * Number(get_currency?.currency_rate));
	let cash_pay = 0;
	$: {
		if (default_cash_pay > 0) {
			cash_pay = default_cash_pay;
		} else {
			cash_pay = 0;
		}
	}
	let cash_pay_exhange = 0;
	$: total_bank_pay =
		bank_pay +
		(bank_pay_exhange * Number(get_currency?.currency_rate)) / Number(get_currency?.exchang_rate);
	$: total_cash_pay =
		cash_pay +
		(cash_pay_exhange * Number(get_currency?.currency_rate)) / Number(get_currency?.exchang_rate);
	$: return_or_credit = Number(total_bank_pay) + Number(total_cash_pay) - after_disc;
</script>

<!-- Modal -->
<div
	class="modal fade"
	id="billing"
	tabindex="-1"
	aria-labelledby="billing"
	data-bs-backdrop="static"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<form
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;
				$globalLoading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					$globalLoading = false;
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_update_billing')?.click();
					}
				};
			}}
			method="post"
			action="?/update_billing"
			class="modal-content"
		>
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="billing">ការទូទាត់ប្រាក់</h1>
				<button
					id="close_update_billing"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				></button>
			</div>
			<div class="modal-body m-2">
				<div class="">
					<div class=" pb-2">
						<table class="table table-bordered table-success">
							<tbody>
								<tr>
									<td class="fs-5">សរុប</td>
									<td
										><Currency
											class="fs-5"
											amount={get_billing?.sub_total}
											symbol={get_currency?.currency_symbol}
										/></td
									>
									<td>
										<Currency
											class="fs-5"
											amount={get_billing?.sub_total}
											symbol={get_currency?.exchang_to}
											rate={get_currency?.currency_rate}
											rate_to={get_currency?.exchang_rate}
										/></td
									>
								</tr>
								<tr>
									<td class="fs-5">បញ្ជុះតម្លៃជា​{get_currency?.currency_symbol} ឬ %</td>
									<td colspan="2">
										<input
											name="disc"
											pattern="[0-9]+%?"
											bind:value={disc}
											class="form-control"
											type="text"
										/>
									</td>
								</tr>
								<tr>
									<td class="fs-5">សរុបចុងក្រោយ</td>
									<td
										><Currency
											class="fs-5"
											amount={after_disc}
											symbol={get_currency?.currency_symbol}
										/></td
									>
									<td>
										<Currency
											class="fs-5"
											amount={after_disc}
											symbol={get_currency?.exchang_to}
											rate={get_currency?.currency_rate}
											rate_to={get_currency?.exchang_rate}
										/>
									</td></tr
								>
								<tr>
									<td class="fs-5"
										>{#if Number(return_or_credit) < 0}
											<span class="fs-5">នៅសល់ </span>
										{:else}
											<span class="fs-5">ប្រាក់អាប់ </span>
										{/if}</td
									>
									<td>
										<Currency
											class="fs-5"
											amount={Number(return_or_credit)}
											symbol={get_currency?.currency_symbol}
										/>
									</td>
									<td>
										<Currency
											class="fs-5"
											amount={Number(return_or_credit)}
											rate={get_currency?.currency_rate}
											rate_to={get_currency?.exchang_rate}
											symbol={get_currency?.exchang_to}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class=" alert alert-primary">
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">ទឹកប្រាក់ទទួល</span>
						</div>
						<div class="col">
							<input type="hidden" name="cash_pay" value={total_cash_pay} />
							<CurrencyInput
								class="input-group mb-2"
								bind:amount={cash_pay}
								symbol={get_currency?.currency_symbol}
								name="cash_pay_base_currency"
							/>
							<CurrencyInput
								bind:amount={cash_pay_exhange}
								symbol={get_currency?.exchang_to}
								name="cash_pay_exhagne_rate"
							/>
						</div>
					</div>
					<hr />
					<div class="row">
						<div class="col-4">
							<span class="fs-5">បង់តាមធនាគារ </span>
						</div>
						<div class="col">
							<input value={total_bank_pay} type="hidden" name="bank_pay" />
							<CurrencyInput
								class="input-group mb-2"
								bind:amount={bank_pay}
								symbol={get_currency?.currency_symbol}
								name="bank_pay_"
							/>
							<CurrencyInput
								class="input-group mb-2"
								bind:amount={bank_pay_exhange}
								symbol={get_currency?.exchang_to}
								name="bank_pay_exhange"
							/>

							<select class="form-control" name="payment_type_id" id="payment_type_id">
								{#each get_payment_types as item}
									<option value={item.id}>{item.by}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
				<div class=" alert alert-success">
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">ឯកសាយោង</span>
						</div>
						<div class="col">
							<input name="image" class="form-control" accept="image/*" type="file" />
						</div>
					</div>
					<div class="row">
						<div class="col-4">
							<span class="fs-5">ចំណាំ</span>
						</div>
						<div class="col">
							<textarea
								value={get_billing?.note ?? ''}
								name="note"
								class="form-control"
								rows="4"
								id=""
							></textarea>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<SubmitButton {loading} name="បង់ប្រាក់" />
			</div>
		</form>
	</div>
</div>
