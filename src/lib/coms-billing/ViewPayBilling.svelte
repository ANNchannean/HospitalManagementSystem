<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/billing/report/$types';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import Currency from '$lib/coms/Currency.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	type Data = Pick<PageServerData, 'get_billings' | 'get_currency'>;
	export let data: Data;
	$: ({ get_billings, get_currency } = data);
	$: find_billing = get_billings[0];
	let payment_id: number;
</script>

<DeleteModal action="?/delete_payment" id={payment_id} />
<div class="modal fade" id="view_pay_billing" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">
					Invoice# {find_billing?.id}
					{find_billing?.patient?.name_khmer}
				</h4>
				<button
					id="close-view_pay_billing"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="table-responsive">
					<table class="table">
						<thead class="table-active">
							<tr>
								<th>Date</th>
								<th>Note</th>
								<th>Amomunt</th>
								<th>Paid By</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each find_billing?.payment || [] as item}
								<tr>
									<td>
										<DateTimeFormat date={item.datetime} />
									</td>
									<td>{item.note ?? ''}</td>
									<td>
										<Currency class="" amount={item.value} symbol={get_currency?.currency_symbol} />
									</td>
									<td>{item.paymentType?.by ?? ''}</td>
									<td>
										<!-- Example single danger button -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div class="">
											<button
												data-bs-toggle="modal"
												data-bs-target="#add_pay_billing"
												class="btn btn-sm btn-primary"><i class="fa-solid fa-file-pen"></i></button
											>
											<button
												on:click={() => {
													payment_id = 0;
													payment_id = item.id;
												}}
												data-bs-toggle="modal"
												data-bs-target="#delete_modal"
												class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-alt"></i></button
											>
											{#if item.fileOrPicture?.filename}
												<a
													class="btn btn-secondary btn-sm"
													target="_blank"
													href="/files/{item.fileOrPicture?.filename}"
													><i class="fa-solid fa-file"></i></a
												>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
