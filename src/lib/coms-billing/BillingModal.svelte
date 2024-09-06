<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { globalLoading } from '$lib/store';
	import type { PageServerData } from '../../routes/(dash)/billing/single/[id]/$types';
	export let data: PageServerData;
	$: ({ get_billing, get_payment_types } = data);
	let loading = false;
	let disc = '';
	$: final_disc = disc.includes('%')
		? Number(get_billing?.sub_total) -
			(Number(get_billing?.sub_total) * Number(disc.replace('%', ''))) / 100
		: Number(get_billing?.sub_total) - Number(disc);
	let bank_pay = 0;
	$: cash_pay = (final_disc - bank_pay).toFixed(2);
	$: return_or_credit = (Number(bank_pay) + Number(cash_pay) - final_disc).toFixed(2);
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
				<div class=" alert alert-success">
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">សរុប</span>
						</div>
						<div class="col">
							<span class="fs-5"
								>{Intl.NumberFormat('en-US')
									.format(Number(Number(get_billing?.sub_total) * Number(get_billing?.exchang)))
									.concat(' \u17DB')}</span
							> <br />
							<span class="fs-5"
								>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
									Number(get_billing?.sub_total)
								)}</span
							>
						</div>
					</div>
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">បញ្ជុះតម្លៃ</span>
						</div>
						<div class="col">
							<input
								name="disc"
								pattern="[0-9]+%?"
								bind:value={disc}
								class="form-control"
								type="text"
							/>
						</div>
					</div>
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">សរុបចុងក្រោយ</span>
						</div>
						<div class="col">
							<span class="fs-5"
								>{Intl.NumberFormat('en-US')
									.format(final_disc * Number(get_billing?.exchang))
									.concat(' \u17DB')}</span
							><br />
							<span class="fs-5"
								>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
									final_disc
								)}</span
							>
						</div>
					</div>
					<div class="row pb-2">
						<div class="col-4">
							{#if Number(return_or_credit) < 0}
								<span class="fs-5">នៅសល់ </span>
							{:else}
								<span class="fs-5">ប្រាក់អាប់ </span>
							{/if}
						</div>
						<div class="col">
							<span class="fs-5"
								>{Intl.NumberFormat('en-US')
									.format(Number(return_or_credit) * Number(get_billing?.exchang))
									.concat(' \u17DB')}</span
							> <br />
							<span class="fs-5"
								>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
									Number(return_or_credit)
								)}</span
							>
						</div>
					</div>
				</div>

				<div class=" alert alert-success">
					<div class="row pb-2">
						<div class="col-4">
							<span class="fs-5">ចំនួនទឹកប្រាក់</span>
						</div>
						<div class="col">
							<input name="cash_pay" bind:value={cash_pay} class="form-control" type="text" />
						</div>
					</div>
					<div class="row">
						<div class="col-4">
							<span class="fs-5">បង់តាមធនាគារ</span>
						</div>
						<div class="col">
							<input name="bank_pay" bind:value={bank_pay} class="form-control mb-2" type="text" />
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
