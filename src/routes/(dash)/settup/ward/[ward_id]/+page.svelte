<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { page } from '$app/stores';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	export let data: PageServerData;
	let room_id: number;
	let ward_id: number;
	let bed_id: number;
	let loading = false;
	$: ({ get_ward, get_products, get_wards } = data);
	$: find_room = get_ward?.room.find((e) => e.id === room_id);
	$: find_rooms = get_ward?.room.filter((e) => e.id === ward_id);
	$: find_bed = find_room?.bed.find((e) => e.id === bed_id);
</script>

<!-- @_Add_bed-->
<div class="modal fade" id="create_bed" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_bed?.id ? '?/update_bed' : '?/create_bed'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;

					if (result.type !== 'failure') document.getElementById('close_create_bed')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Bed</h4>
				<button
					on:click={() => {
						bed_id = 0;
					}}
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
								<input value={$page.params.ward_id} type="hidden" name="ward_id" />
								<input value={room_id} type="hidden" name="room_id" />
								<input value={find_bed?.id ?? ''} type="hidden" name="bed_id" />
								<label for="bed">Bed</label>
								<input
									value={find_bed?.bed ?? ''}
									name="bed"
									type="text"
									class="form-control"
									id="bed"
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
				{#if find_bed }
					Delete
				{/if}
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
								<input value={$page.params.ward_id} type="hidden" name="ward_id" />
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
<!-- @_Update_Room-->
<div class="modal fade" id="update_room" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/update_room"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;

					room_id = 0;
					if (result.type !== 'failure') document.getElementById('close_update_room')?.click();
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Room</h4>
				<button
					id="close_update_room"
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
								<label for="ward">Ward</label>
								<select class="form-control" name="ward_id" id="ward_id">
									{#each get_wards as { ward, id }}
										<option selected={find_room?.ward_id === id} value={id}>{ward}</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<input type="hidden" name="room_id" value={find_room?.id ?? ''} />
								<label for="ward">Room</label>
								<input
									value={find_room?.room ?? ''}
									name="room"
									type="text"
									class="form-control"
									id="room"
								/>
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
										<option selected={find_room?.product_id === id} value={id}>{products}</option>
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

<div class="row">
	<div class="col-sm-6">
		<h2>
			<a href="/settup/ward" class="btn btn-link p-0 text-secondary"
				><i class="fa-solid fa-rotate-left"></i>
				Back
			</a>
		</h2>
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
		<div class="card bg-light">
			<div class="card-header fs-4">
				<div class="row">
					<div class="col">
						<span># {get_ward?.ward ?? ''} </span>
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_room"
							><i class="fa-solid fa-square-plus"></i>
							New Room
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<DeleteModal action="?/delete_room" id={room_id} />
<div class="row">
	<div data-bs-sveltekit-noscroll class="col-sm-12">
		{#each get_ward?.room || [] as { id, room, product }}
			{@const active = id === room_id ? true : false}
			<div class="btn-group me-3 mt-3">
				<button
					on:click={() => (room_id = id)}
					type="button"
					class={active ? `btn btn-dark` : 'btn btn-outline-dark'}
					>{room ?? ''} {product?.products ?? ''}
				</button>
				{#if room_id === id}
					<button
						data-bs-toggle="modal"
						data-bs-target="#update_room"
						type="button"
						class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button
					>
					<button
						type="button"
						class="btn btn-outline-danger btn-sm"
						data-bs-toggle="modal"
						data-bs-target="#delete_modal"
						><i class="fa-solid fa-trash-can"></i>
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
<hr />
<div class="row">
	{#if find_room}
		<div class="col"></div>
		<div class="col-auto">
			<button
				type="button"
				class="btn btn-success"
				data-bs-toggle="modal"
				data-bs-target="#create_bed"
				><i class="fa-solid fa-square-plus"></i>
				New Bed
			</button>
		</div>
	{/if}
</div>

<div class="row">
	{#each find_room?.bed || [] as { bed, id }}
		<div class="col-sm-3">
			<button
				data-bs-toggle="modal"
				data-bs-target="#create_bed"
				on:click={() => {
					bed_id = 0;
					bed_id = id;
				}}
				class="btn btn-success m-2"
			>
				<i class="fa-solid fa-bed fa-6x"></i> <br />
				<h3>{bed ?? ''}</h3>
			</button>
		</div>
	{/each}
</div>
