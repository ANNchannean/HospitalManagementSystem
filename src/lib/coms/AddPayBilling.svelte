<script lang="ts">
	import { enhance } from '$app/forms';
	import { globalLoading } from '$lib/store';
	import type { PageServerData, ActionData } from '../../routes/(dash)/billing/sale-reprot/$types';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	export let billing_id: number;
	export let value: number;
	$: ({ get_billings, get_payment_types } = data);
	$: find_billing = get_billings.find((e) => e.id === billing_id);
	let loading = false;
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
							<label for="amount">Amount</label>
							<input
								bind:value
								class="form-control"
								type="number"
								name="value"
								step="any"
								id="amount"
							/>
							<label class="fs-4" for="amount">
								{new Intl.NumberFormat('en-US')
									.format(Number(value))
									.concat(' \u17DB')}</label
							>
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
