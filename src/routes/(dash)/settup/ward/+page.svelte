<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	let ward_id: number;
	let loading = false;
	$: ({ wards, get_products } = data);
	$: find_word = wards.find((e) => e.id === ward_id);
</script>

<DeleteModal action="?/create_bed" id={find_word?.id} />
<!-- @_Add_bed-->
<div class="modal fade" id="create_bed" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_bed"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					ward_id = 0;
					if (result.type !== 'failure') document.getElementById('close_create_bed')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Bed</h4>
				<button
					id="close_create_bed"
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
								<input value={find_word?.id} type="hidden" name="ward_id" />
								<label for="bed">Bed</label>
								<input name="bed" type="text" class="form-control" id="bed" />
								<!-- {#if form?.ward}
									<p class="text-danger">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="bed">Room</label>
								<select class="form-control" name="room_id" id="room_id">
									{#each find_word?.room || [] as { id, room }}
										<option value={id}>{room}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
<!-- @_Add_Room-->
<div class="modal fade" id="create_room" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_room"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					ward_id = 0;
					if (result.type !== 'failure') document.getElementById('close_room')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Room</h4>
				<button
					id="close_room"
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
								<input value={find_word?.id} type="hidden" name="ward_id" />
								<label for="ward">Room</label>
								<input name="room" type="text" class="form-control" id="room" />
								<!-- {#if form?.ward}
									<p class="text-danger">{$t('common.input_data')}</p>
								{/if} -->
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="ward">Room Type</label>
								<select class="form-control" name="product_id" id="product_id">
									{#each get_products as { products, id }}
										<option value={id}>{products}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
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
			<div class="modal-footer justify-content-end">
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
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Ward</th>
							<th>Room</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each wards as { bed, room, ward, id }, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{ward}</td>
								<td
									><div>
										<a href="/settup/ward/{id}" class="btn btn-primary btn-sm"
											>{room.length} <i class="fa-solid fa-window-maximize"></i>
										</a>
										<a
											on:click={() => {
												ward_id = 0;
												ward_id = id;
											}}
											href={'#'}
											type="button"
											class="btn btn-light btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create_room"
											><i class="fa-solid fa-square-plus"></i>
										</a>
									</div></td
								>

								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												ward_id = 0;
												ward_id = id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create_ward"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												ward_id = 0;
												ward_id = id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
										</a>
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
