<script lang="ts">
	import type { ActionData, PageServerData } from '../../routes/(dash)/patient/all/$types';
	import { enhance } from '$app/forms';
	import ImagePreview from '$lib/coms/ImagePreview.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { t } from '$lib/translations';
	import Select from '$lib/coms/Select.svelte';
	import { dobToAge, now_date } from '$lib/helper';
	export let form: ActionData;
	export let data: PageServerData;
	$: ({ get_province, get_patients } = data);
	let loading = false;
	export let patient_id: number;
	export let province_id: number;
	export let district_id: number;
	export let commune_id: number;
	export let village_id: number;
	export let age: number = 0;
	export let dob: string = '';
	$: find_patient = get_patients.find((e) => e.id === patient_id);
	$: dob = dob ? dob : now_date(new Date().toISOString());
	$: find_province = get_province.find((e) => e.id === province_id);
	$: find_district = find_province?.district.find((e) => e.id === district_id);
	$: find_commune = find_district?.commune.find((e) => e.id === commune_id);
	$: src = '';
	function handleAGE(e: string) {
		age = dobToAge({
			d: +e.slice(8, 10),
			m: +e.slice(5, 7),
			y: +e.slice(0, 4),
			date: new Date()
		}).y;
	}
	function handleDOB(e: number) {
		let plan_age = new Date().getFullYear() - e;
		dob = plan_age.toString().concat(dob.slice(4, 10));
		// if(e === 0 || !e ) {
		// 	dob = now_date(new Date().toISOString());
		// }
	}
	function onChange(event: any) {
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e: any) {
				src = e.target.result;
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	}
</script>

<!-- @_Add_Patient -->
<div class="modal fade" id="create-patient" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			action={find_patient?.id ? '?/update_patient' : '?/create_patient'}
			method="post"
			enctype="multipart/form-data"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_create_patient')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Patient</h4>
				<button
					on:click={() => {
						src = '';
						patient_id = 0;
						dob = '';
						age = 0;
						province_id = 0;
						district_id = 0;
						commune_id = 0;
						village_id = 0;
					}}
					id="close_create_patient"
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
						<div class="col-md-6">
							<input value={find_patient?.id} type="hidden" name="patient_id" />
							<input
								value={find_patient?.fileOrPicture?.filename ?? ''}
								type="hidden"
								name="old_image"
							/>
							<div class="form-group pb-3">
								<label for="name_khmer">Name Khmer</label>
								<input
									value={find_patient?.name_khmer ?? ''}
									required
									minlength="1"
									name="name_khmer"
									type="text"
									class="form-control"
									id="name_khmer"
								/>
								{#if form?.name_khmer}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group pb-3">
								<label for="name_latin">Name Latin</label>
								<input
									required
									value={find_patient?.name_latin ?? ''}
									name="name_latin"
									type="text"
									class="form-control"
									id="name_latin"
								/>
								{#if form?.name_latin}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<div class="form-group pb-3">
								<label for="gender">Gender</label>
								<select
									required
									value={find_patient?.gender ?? ''}
									name="gender"
									class="form-control"
									id="gender"
								>
									<option value="">Other</option>
									<option selected value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
								{#if form?.gender}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group pb-3">
								<label for="dob">DOB</label>
								<input
									on:input={(e) => handleAGE(e.currentTarget.value)}
									value={dob}
									name="dob"
									type="date"
									class="form-control"
									id="dob"
								/>

								{#if form?.dob}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group pb-3">
								<label for="name_khmer">age </label>

								<input
									on:input={(e) => handleDOB(Number(e.currentTarget.value))}
									value={age}
									name="age"
									type="number"
									class="form-control"
									id="age"
								/>

								{#if form?.age}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>

						<div class="col-md-3">
							<div class="form-group pb-3">
								<label for="telephone">telephone</label>
								<input
									value={find_patient?.telephone ?? ''}
									name="telephone"
									type="text"
									class="form-control"
									id="telephone"
								/>
								{#if form?.telephone}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-6">
							<div class="form-group pb-3">
								<label for="province">Province</label>
								<Select
									bind:value={province_id}
									name="province_id"
									items={get_province.map((e) => ({
										id: e.id,
										name: e.name_khmer.concat(' ').concat(e.name_latin)
									}))}
								/>

								{#if form?.province_id}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-6">
							<div class="form-group pb-3">
								<label for="district">District</label>
								<Select
									bind:value={district_id}
									name="district_id"
									items={find_province?.district.map((e) => ({
										id: e.id,
										name: e.name_khmer.concat(' ').concat(e.name_latin)
									})) || []}
								/>

								{#if form?.district_id}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6">
							<div class="form-group pb-3">
								<label for="commune">Commune</label>
								<Select
									bind:value={commune_id}
									name="commune_id"
									items={find_district?.commune.map((e) => ({
										id: e.id,
										name: e.name_khmer.concat(' ').concat(e.name_latin)
									})) || []}
								/>

								{#if form?.commune_id}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-sm-6">
							<div class="form-group pb-3">
								<label for="village">Village</label>
								<Select
									bind:value={village_id}
									name="village_id"
									items={find_commune?.village.map((e) => ({
										id: e.id,
										name: e.name_khmer.concat(' ').concat(e.name_latin)
									})) || []}
								/>

								{#if form?.village_id}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-8">
							<div class="form-group pb-3">
								<label for="Other">Other</label>
								<input
									value={find_patient?.other ?? ''}
									name="other"
									type="text"
									class="form-control"
									id="Other"
								/>
								{#if form?.other}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
							<div class="form-group pb-3">
								<label for="exampleInputFile">Picture</label>
								<div class="input-group">
									<input
										on:change={onChange}
										type="file"
										name="image"
										accept="image/*"
										class="form-control"
										id="exampleInputFile"
									/>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<ImagePreview {src} link={find_patient?.fileOrPicture?.filename ?? ''} />
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
