<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { ActionData, PageServerData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SelectRef from '$lib/components/etc/SelectRef.svelte';
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/etc/Toast.svelte';
	import { globalLoading } from '$lib/store';
	import SubmiteSearch from '$lib/components/etc/SubmiteSearch.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({
		get_products,
		get_product_group_type,
		charge_on_imagerie,
		charge_on_laboratory,
		charge_on_general,
		charge_on_prescription,
		charge_on_service,
		get_billing,
		get_payment_types
	} = data);

	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	let loading = false;
	let product_group_id: number;
	let inerHight: string;
	let inerHight_1: string;
	$: items =
		Number(charge_on_imagerie?.productOrder.length || 0) +
		Number(charge_on_laboratory?.productOrder.length || 0) +
		Number(charge_on_general?.productOrder.length || 0) +
		Number(charge_on_prescription?.productOrder.length || 0) +
		Number(charge_on_service?.productOrder.length || 0);
	onMount(() => {
		inerHight = (window.innerHeight - (window.innerHeight * 23) / 100).toString().concat('px');
		inerHight_1 = (window.innerHeight - (window.innerHeight * 45) / 100).toString().concat('px');
	});
	let disc = '';
	$: final_disc = disc.includes('%')
		? Number(get_billing?.sub_total) -
			(Number(get_billing?.sub_total) * Number(disc.replace('%', ''))) / 100
		: Number(get_billing?.sub_total) - Number(disc);
	let bank_pay = 0;
	$: cash_pay = (final_disc - bank_pay).toFixed(2);
	$: return_or_credit = (Number(bank_pay) + Number(cash_pay) - final_disc).toFixed(2);
</script>

{#if form?.disc}
	<Toast message="ការបញ្ជុះតម្លៃត្រូវតែជា (10% ឫ 10 )" />
{/if}
{#if form?.errProductOrder}
	<Toast message="សូមជ្រើសរើសឈ្មោះអ្នកជំងឺ!" />
{/if}
<div class="row">
	<div class="col-sm-6">
		<h2>Billing OPD</h2>
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
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-money-bills"></i>
					Billing
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-stethoscope"></i>
					OPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-md-6">
		<div class="card bg-light">
			<div class="card-header">
				<div class=" row">
					<div class="col-12 pb-2">
						<table class="table m-0">
							<tr>
								<td>ឈ្មេះអ្នកជំងឺ</td>
								<td>:</td>
								<td
									>{get_billing?.visit?.patient?.name_khmer}
									@{get_billing?.visit?.patient?.name_latin}
								</td>
								<td
									>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
										.format(new Date(get_billing?.visit?.date_checkup ?? ''))
										.split('/')
										.join('-')}
									{new Intl.DateTimeFormat('en-GB', {
										timeStyle: 'short',
										hour12: true
									}).format(new Date(get_billing?.visit?.date_checkup ?? ''))}
								</td>
							</tr>
						</table>
					</div>
					<SubmiteSearch
						placeholder="ស្វែករកតាមរយៈផលិតផល"
						items={get_products.map((e) => ({ id: e.id, name: e.products, price: e.price }))}
					/>
				</div>
			</div>
			<form
				data-sveltekit-keepfocus
				on:change={(e) => e.currentTarget.requestSubmit()}
				use:enhance={() => {
					$globalLoading = true;
					return async ({ update }) => {
						await update({ reset: false });
						$globalLoading = false;
					};
				}}
				action="?/update_product_order"
				method="post"
			>
				<div style="height: {inerHight_1}; " class=" overflow-y-auto table-responsive">
					<table class="table table-bordered table-sm">
						<thead class="table-primary table-active position-sticky top-0">
							<tr class="text-center">
								<th style="width: 45%;">Product</th>
								<th style="width: 15%;">Price</th>
								<th style="width: 10%;">Qty</th>
								<th style="width: 10%;">Disc</th>
								<th style="width: 15%;">Subtotal </th>
								<th style="width: 5%;">X</th>
							</tr>
						</thead>
						<tbody>
							<!-- Laboratory  -->
							{#if charge_on_laboratory?.productOrder.length}
								<tr class="text-center">
									<td colspan="4" class="text-start">
										{#each charge_on_laboratory.productOrder as item (item.id)}
											<span>
												&nbsp;{item.product?.products}
											</span> <br />
										{/each}
									</td>
									<td>
										<input type="hidden" name="charge_id" value={charge_on_laboratory.id ?? ''} />
										<input
											class="border-0 bg-light w-100 text-center text-primary"
											type="number"
											min="0"
											step="any"
											name="charge_on_laboratory"
											value={charge_on_laboratory.price ?? ''}
										/></td
									>
								</tr>
							{/if}
							<!-- Imagerie  -->
							{#if charge_on_imagerie?.productOrder.length}
								{#each charge_on_imagerie.productOrder as item (item.id)}
									<tr class="text-center">
										<td class="text-start">
											&nbsp;{item.product?.products}
											<br />
										</td>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="price"
												value={item?.price?.toFixed(2)}
											/></td
										>
										<td>
											<input type="hidden" name="product_order_id" value={item.id} />
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="qty"
												value={item?.qty}
											/></td
										>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="text"
												pattern="[0-9]+%?"
												name="disc"
												value={item?.discount}
											/></td
										>
										<td
											>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
												item.total ?? 0
											)}</td
										>
										<td> </td>
									</tr>
								{/each}
							{/if}
							<!-- Prescription  -->
							{#if charge_on_prescription?.productOrder.length}
								{#each charge_on_prescription.productOrder as item (item.id)}
									<tr class="text-center">
										<td class="text-start">
											&nbsp;{item.product?.products}
											{#each get_billing.visit?.presrciption || [] as item_1}
												{#if item_1.product_id === item.product_id}
													<span class="badge text-bg-primary"
														>{item_1.product?.generic_name ?? ''}</span
													>
													<br />
													<span class="badge text-bg-success">{item_1.use}</span>
													<span class="badge text-bg-warning">
														{#if item_1.morning !== 0}
															Morning {item_1.morning}
														{/if}
													</span>
													<span class="badge text-bg-warning">
														{#if item_1.noon !== 0}
															Noon {item_1.noon}
														{/if}
													</span>
													<span class="badge text-bg-warning">
														{#if item_1.afternoon !== 0}
															Afternoon {item_1.afternoon}
														{/if}
													</span>
													<span class="badge text-bg-warning">
														{#if item_1.evening !== 0}
															Evening {item_1.evening}
														{/if}
													</span>
													<span class="badge text-bg-warning">
														{#if item_1.night !== 0}
															Night {item_1.night}
														{/if}
													</span>
												{/if}
											{/each}

											<br />
										</td>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="price"
												value={item?.price?.toFixed(2)}
											/></td
										>
										<td>
											<input type="hidden" name="product_order_id" value={item.id} />
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="qty"
												value={item?.qty}
											/></td
										>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="text"
												pattern="[0-9]+%?"
												name="disc"
												value={item?.discount}
											/></td
										>
										<td
											>{Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' }).format(
												item.total ?? 0
											)}</td
										>
										<td> </td>
									</tr>
								{/each}
							{/if}
							<!-- Service -->
							{#if charge_on_service?.productOrder.length}
								{#each charge_on_service.productOrder as item (item.id)}
									<tr class="text-center">
										<td class="text-start">
											&nbsp;{item.product?.products}
											<br />
										</td>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="price"
												value={item?.price?.toFixed(2)}
											/></td
										>
										<td>
											<input type="hidden" name="product_order_id" value={item.id} />
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="qty"
												value={item?.qty}
											/></td
										>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="text"
												pattern="[0-9]+%?"
												name="disc"
												value={item?.discount}
											/></td
										>
										<td
											>{Intl.NumberFormat('en-US')
												.format(item.total ?? 0)
												.concat(' \u17DB')}</td
										>
										<td> </td>
									</tr>
								{/each}
							{/if}
							<!-- General  -->
							{#if charge_on_general?.productOrder.length}
								{#each charge_on_general.productOrder as item (item.id)}
									<tr class="text-center">
										<td class="text-start">
											&nbsp;{item.product?.products}
											<br />
										</td>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="price"
												value={item?.price?.toFixed(2)}
											/></td
										>
										<td>
											<input type="hidden" name="product_order_id" value={item.id} />
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="number"
												min="0"
												step="any"
												name="qty"
												value={item?.qty}
											/></td
										>
										<td>
											<input
												class="border-0 bg-light w-100 text-center text-primary"
												type="text"
												pattern="[0-9]+%?"
												name="disc"
												value={item?.discount}
											/></td
										>
										<td
											>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
												item.total ?? 0
											)}</td
										>
										<td>
											<form
												action="?/remove_product_order"
												use:enhance={() => {
													$globalLoading = true;
													return async ({ update }) => {
														await update();
														$globalLoading = false;
													};
												}}
												method="post"
											>
												<input type="hidden" name="product_order_id" value={item.id} />
												<button type="submit" class="btn btn-link text-danger"
													><i class="fa-solid fa-trash"></i></button
												>
											</form>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
				<div class="card-header">
					<table class="table table-sm mt-2 fs-5">
						<tr class="">
							<td></td>
							<td>ចំនួនទំនិញ</td>
							<td>:</td>
							<td>{items} មុខ </td>
						</tr>
						<tr>
							<td></td>
							<td>សរុប </td>
							<td>:</td>
							<td>
								{Intl.NumberFormat('en-US')
									.format(Number(Number(get_billing?.sub_total) * Number(get_billing.exchang)))
									.concat(' \u17DB')}
							</td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td>:</td>
							<td>
								{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
									get_billing.sub_total ?? 0
								)}
							</td>
						</tr>
					</table>

					<hr />
					<div class="row">
						<!-- <div class="col">
							<button class="btn btn-danger btn-lg w-100">
								<i class="fa-solid fa-eraser"></i> លុប</button
							>
						</div> -->
						<div class="col">
							<button type="button" class="btn btn-primary btn-lg w-100">
								<i class="fa-regular fa-hand"></i> កត់ទុក</button
							>
						</div>
						<div class="col">
							<button
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#billing"
								formaction="?/update_billing"
								class="btn btn-success btn-lg w-100"
							>
								<i class="fa-solid fa-comments-dollar"></i> គិតលុយ</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="col-md-6">
		<div class="card bg-light">
			<form
				on:change={(e) => e.currentTarget.requestSubmit()}
				data-sveltekit-keepfocus
				class="card-header"
			>
				<div class="row">
					<div class="col-md-6">
						<div class="row">
							<div class="col">
								<SelectRef
									mainParams="?group_type_id"
									chailParams={`&${$page.url.searchParams.get('q') || ''}`}
									bind:value={product_group_id}
									items={get_product_group_type.map((e) => ({ id: e.id, name: e.group_type }))}
								/>
							</div>
						</div>
					</div>

					<div class="col-md-6">
						<input
							type="hidden"
							name="billing_id"
							value={$page.url.searchParams.get('billing_id')}
						/>
						<input
							on:input={handleQ}
							name="q"
							type="search"
							class="form-control"
							placeholder="Filter Products"
							aria-label="Filter Products"
							aria-describedby="Filter Products"
						/>
					</div>
				</div>
			</form>

			<div style="height: {inerHight};" class=" overflow-auto justify-content-start">
				{#each get_products as item}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<form
						on:click={(e) => e.currentTarget.requestSubmit()}
						style="min-height: 200px;"
						method="post"
						use:enhance={() => {
							$globalLoading = true;
							return async ({ update }) => {
								await update();
								$globalLoading = false;
							};
						}}
						action="?/create_product_order"
						class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 border m-2 p-2 btn btn-light"
					>
						<input type="hidden" name="product_id" value={item.id} />
						<input type="hidden" name="price" value={item.price} />
						<button type="button" class="position-relative text-wrap btn m-0 p-0">
							<img class="img-thumbnail" src="/no-image.jpg" alt="" />
							<span
								class="position-absolute start-50 translate-middle badge rounded-pill bg-danger"
							>
								{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
									item.price
								)}
							</span>
							<span
								class="position-absolute start-50 translate-middle badge rounded-pill bg-danger"
							>
								{new Intl.NumberFormat('en-US').format(item.price).concat(' \u17DB')}
							</span>
						</button>
						<span class="fs-6 text-wrap">{item.products}</span>
					</form>
				{/each}
			</div>
		</div>
	</div>
</div>

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
				return async ({ update, result }) => {
					await update({ reset: false });
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
									.format(Number(Number(get_billing?.sub_total) * Number(get_billing.exchang)))
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
									.format(final_disc * Number(get_billing.exchang))
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
									.format(Number(return_or_credit) * Number(get_billing.exchang))
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
