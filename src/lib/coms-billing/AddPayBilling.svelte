<script lang="ts">
	import { enhance } from '$app/forms';
	import { globalLoading } from '$lib/store';
	import type { PageServerData, ActionData } from '../../routes/(dash)/billing/report/$types';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	import CurrencyInput from '$lib/coms/CurrencyInput.svelte';
	type Data = Pick<PageServerData, 'get_billings' | 'get_currency' | 'get_payment_types'>;
	export let data: Data;
	export let form: ActionData;
	$: ({ get_billings, get_payment_types, get_currency } = data);
	$: find_billing = get_billings[0];
	export let balance = 0;
	let loading = false;
	$: pay = balance;
	let pay_1 = 0;
	$: total_pay =
		pay + (pay_1 * Number(get_currency?.currency_rate)) / Number(get_currency?.exchang_rate);
</script>

{#if form?.billing_id}
	<Toast message="Billing ID not Found" />
{/if}
{#if form?.payment_type_id}
	<Toast message="Payment Type ID not Found" />
{/if}
{#if form?.value}
	<Toast message="Input value" />
{/if}
<div class="modal fade" id="add_pay_billing" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<form
			enctype="multipart/form-data"
			action="?/repayment"
			use:enhance={() => {
				$globalLoading = true;
				return async ({ update, result }) => {
					await update();
					$globalLoading = false;
					if (result.type !== 'failure') document.getElementById('close_add_pay_billing')?.click();
				};
			}}
			method="post"
			class="modal-content"
		>
			<input type="hidden" name="billing_id" value={find_billing?.id} />
			<input type="hidden" name="disc" value={find_billing?.discount} />
			<input type="hidden" name="tax" value={find_billing?.tax} />
			<div class="modal-header">
				<h4 class="modal-title">
					Invoice# {find_billing?.id}
					{find_billing?.visit?.patient?.name_khmer}
				</h4>
				<button
					id="close_add_pay_billing"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="alert alert-success mt-2">
					<div class="row">
						<div class="col">
							<input type="hidden" name="value" value={total_pay} />
							<label for="amount">Amount</label>
							<CurrencyInput
								class="input-group pb-2"
								bind:amount={pay}
								symbol={get_currency?.currency_symbol}
							/>
							<CurrencyInput bind:amount={pay_1} symbol={get_currency?.exchang_to} />
						</div>
						<div class="col">
							<label for="payment_type_id">Paying By</label>
							<select class="form-control" name="payment_type_id" id="payment_type_id">
								{#each get_payment_types as item}
									<option value={item.id}>{item.by}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
				<label for="file">Document</label>
				<input class="form-control" type="file" accept="*/image" name="file" id="file" />
				<label for="note">Note</label>
				<textarea class="form-control" rows="4" name="note" id="note" />
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
