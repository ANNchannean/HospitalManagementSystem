<script lang="ts">
	import { enhance } from '$app/forms';
	import { inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_clinic_info } = data);
	let edit = false;
	let loading = false;
	let file1: any;
</script>

<div class="row">
	<div class="col-sm-6">
		<h2>Clinic Info</h2>
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
				<a href="/settup/clinic-info" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-circle-h"></i>
					Clinic info
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<form
			method="post"
			action="?/create_clinic_info"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					loading = false;
					if (result.type !== 'failure') {
						edit = false;
					}
				};
			}}
			enctype="multipart/form-data"
			class="card"
		>
			<input type="hidden" name="id_logo" value={get_clinic_info?.id || ''} />
			<input type="hidden" name="id_logo1" value={get_clinic_info?.id || ''} />
			<input type="hidden" name="logo" value={get_clinic_info?.fileOrPicture[0]?.filename || ''} />
			<input type="hidden" name="logo1" value={get_clinic_info?.fileOrPicture[1]?.filename || ''} />

			<div class="card-header">
				{#if !edit}
					<button
						type="button"
						on:click={() => (edit = !edit)}
						class="float-right btn btn-outline-primary btn-lg"
						><i class="fa-solid fa-pen"></i></button
					>
				{/if}
				{#if edit}
					<button type="submit" class="float-right btn btn-primary btn-lg"
						><i class="fa-solid fa-floppy-disk"></i></button
					>
				{/if}
			</div>
			<div style="max-height: {$inerHight};" class="card-body">
				<section class="invoice border-0">
					<div class="page-header row">
						<div class="col-auto text-center">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								class:border={edit}
								id="imgp1"
								on:click={() => document.getElementById('img')?.click()}
								height="170px"
								class="float-right"
							src="/files/{get_clinic_info?.fileOrPicture[0]?.filename}"
								alt="no logo"
							/>

							{#if edit}
								<input
									on:change={(e) => (file1 = e.target)}
									accept="image/*"
									type="file"
									name="file"
									id="img"
									style="display:none;"
								/>
							{/if}
						</div>
						<div class="col text-center">
							{#if edit}
								<input
									name="title_khm"
									style="font-size: 30px;"
									value={get_clinic_info?.title_khm ?? ''}
									class="form-control form-control-lg text-center kh_font_muol"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}
							{#if !edit}
								<input
									disabled
									style="font-size: 30px;background-color: #FFFFFF;"
									value={get_clinic_info?.title_khm ?? ''}
									class="form-control form-control-lg text-center kh_font_muol form-control-plaintext shadow-none border-0"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}

							{#if edit}
								<input
									name="title_eng"
									style="font-size: 30px;"
									value={get_clinic_info?.title_eng ?? ''}
									class="form-control form-control-lg text-center en_font_times_new_roman"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}
							{#if !edit}
								<input
									disabled
									style="font-size: 30px;background-color: #FFFFFF;"
									value={get_clinic_info?.title_eng ?? ''}
									class="form-control form-control-lg text-center en_font_times_new_roman form-control-plaintext shadow-none border-0"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}

							{#if edit}
								<input
									value={get_clinic_info?.detail ?? ''}
									class="form-control form-control-lg text-center kh_font_battambang"
									type="text"
									required
									autocomplete="off"
									name="detail"
								/>
							{/if}
							{#if !edit}
								<input
									disabled
									style="background-color: #FFFFFF;"
									value={get_clinic_info?.detail ?? ''}
									class="form-control form-control-lg text-center kh_font_battambang form-control-plaintext shadow-none border-0"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}
							{#if edit}
								<input
									name="contact"
									value={get_clinic_info?.contact ?? ''}
									class="form-control form-control-lg text-center kh_font_battambang"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}
							{#if !edit}
								<input
									disabled
									style="background-color: #FFFFFF;"
									value={get_clinic_info?.contact ?? ''}
									class="form-control form-control-lg text-center kh_font_battambang form-control-plaintext shadow-none border-0"
									type="text"
									required
									autocomplete="off"
								/>
							{/if}
						</div>
						<div class="col-auto text-center">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								on:click={() => document.getElementById('img')?.click()}
								height="170px"
								class:border={edit}
								class="float-right"
								src="/files/{get_clinic_info?.fileOrPicture[1]?.filename}"
								alt="no logo"
							/>

							<!-- <label class="btn btn-default" for="img">upload image</label> -->
						</div>
					</div>
				</section>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col">
						{#if edit}
							<input
								value={get_clinic_info?.address ?? ''}
								class="form-control text-center form-control-lg kh_font_battambang"
								type="text"
								required
								autocomplete="off"
								name="address"
							/>
						{/if}
						{#if !edit}
							<input
								disabled
								style="background-color: #FFFFFF;"
								value={get_clinic_info?.address ?? ''}
								class="form-control text-center form-control-lg kh_font_battambang form-control-plaintext shadow-none border-0"
								type="text"
								required
								autocomplete="off"
							/>
						{/if}
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
