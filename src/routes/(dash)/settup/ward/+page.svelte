<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	let ward_id: number;
	let room_id: number;
	let loading = false;
	$: ({ wards, get_products } = data);
	$: find_word = wards.find((e) => e.id === ward_id);
</script>

<DeleteModal action="?/delete_ward" id={ward_id} />
<!-- @_Add_Ward-->
<div class="modal fade" id="create_ward" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_word?.id ? '?/update_ward' : '?/create_ward'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					ward_id = 0;
					if (result.type !== 'failure') document.getElementById('close_ward')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Ward</h4>
				<button
					id="close_ward"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_word?.id} type="hidden" name="id" />
								<label for="ward">Name</label>
								<input
									value={find_word?.ward ?? ''}
									name="ward"
									type="text"
									class="form-control"
									id="ward"
								/>
								<!-- {#if form?.ward}
									<p class="text-danger">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class={find_word
					? 'modal-footer justify-content-between'
					: 'modal-footer justify-content-end'}
			>
				{#if find_word}
					<form
						use:enhance={() => {
							loading = true;
							return async ({ update, result }) => {
								await update();
								loading = false;
								if (result.type !== 'failure') document.getElementById('close_ward')?.click();
							};
						}}
						method="post"
						action="?/delete_ward"
					>
						<input value={find_word?.id ?? ''} type="hidden" name="id" />
						<SubmitButton style="btn btn-danger" name="Delete" {loading} />
					</form>
				{/if}
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2>Ward</h2>
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
					><i class="fas fa-tools"></i>
					Settup
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/settup/ward" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-hotel"></i>
					Ward
				</a>
			</li>
		</ol>
	</div>
</div>
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
					<div class="col-auto">
						<button
							on:click={() => (ward_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_ward"
							><i class="fa-solid fa-square-plus"></i>
							New Ward
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight}" class="card-body table-responsive p-0">
				<table class="table table-sm table-bordered">
					<tbody>
						{#each wards as { room, ward, id }, index}
							<tr>
								<td
									style="width: 35%;"
									class="position-relative text-bg-primary text-center justify-content-center"
								>
									<a href="/settup/ward/{id}" class="btn btn-primary btn-sm fs-3"
										><i class="fa-solid fa-hospital"></i> {ward}
									</a>
									<button
										on:click={() => {
											ward_id = 0;
											ward_id = id;
										}}
										data-bs-toggle="modal"
										data-bs-target="#create_ward"
										type="button"
										class="btn btn-primary btn-sm fs-3"
										><i class="fa-solid fa-file-pen"></i>
									</button>
								</td>
								<td style="width: 65%;" class="text-start p-0 m-0"
									><div class="">
										{#each room as iitem}
											{@const beds = iitem.bed || []}
											<div class="">
												<div class="">
													<table class="table table-sm table-bordered">
														<thead>
															<tr class="p-0 m-0">
																<td
																	style="width: 50%;"
																	class:text-bg-success={!iitem.status}
																	class:text-bg-danger={iitem.status}
																	class="justify-content-center align-content-center text-start fs-5 m-0"
																>
																	<i class="fa-regular fa-window-maximize"></i>
																	{iitem.room}
																	{iitem.product ? `( ${iitem?.product?.products})` : ''}
																</td>
																{#if beds.length}
																	<td
																		style="width: 50%;"
																		class="justify-content-center align-content-center text-center text-bg-warning"
																	>
																		<table class="table p-0 m-0 table-bordered">
																			<tbody>
																				{#each beds as bed}
																					<tr>
																						<td class="text-start">
																							<i class="fa-solid fa-bed"></i>
																							{bed.bed}
																						</td>
																					</tr>
																				{/each}
																			</tbody>
																		</table>
																	</td>
																{:else}
																	<td></td>
																{/if}
															</tr>
														</thead>
													</table>
												</div>
											</div>
										{/each}
									</div></td
								>
								<td style="width: 0%;"></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
