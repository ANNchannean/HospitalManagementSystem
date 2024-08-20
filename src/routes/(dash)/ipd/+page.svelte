<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import Select from '$lib/components/etc/Select.svelte';
	import Words from '$lib/components/etc/Words.svelte';
	import { globalLoading } from '$lib/store';
	import AddBedToIpd from '$lib/components/etc/AddBedToIPD.svelte';
	let loading = false;
	export let data: PageServerData;
	const { get_visit, get_progress_note, get_beds } = data;
	let etiology = get_visit?.etiology || get_progress_note?.etiology || '';
	$: ({ get_staffs, get_patient, get_departments, get_words } = data);

	let bed_id: number = get_progress_note?.bed.id || 0;

	$: find_bed = get_beds.find((e) => e.id === bed_id);
</script>

<AddBedToIpd bind:bed_id {data} />
<div class="row">
	<div class="col-sm-6">
		<h2 class="">New Visit IPD</h2>
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
				<a href="/patient/all" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-restroom"></i>
					All Patient
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class=" fas fa-procedures"></i>
					IPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="card">
	<div class="card-header fs-5">
		<span>#{get_patient?.name_khmer}, </span>
		<span>{get_patient?.name_latin} </span>
	</div>
	<form
		method="post"
		action="?/create_visit_ipd"
		class="form-horizontal"
		use:enhance={() => {
			loading = true;
			$globalLoading = true;
			return async ({ update }) => {
				await update();
				loading = false;
				$globalLoading = false;
			};
		}}
	>
		{#if get_progress_note}
			<input value={get_progress_note?.id ?? ''} type="hidden" name="progress_note_id" />
			<input value={get_progress_note?.bed_id ?? ''} type="hidden" name="old_bed_id" />
		{/if}
		<input value={bed_id} type="hidden" name="bed_id" />
		<input value={get_patient?.id} type="hidden" name="patient_id" />
		<input value={get_visit?.id ?? ''} type="hidden" name="visit_id" />
		<div class="card-body">
			<div class="form-group row pb-3">
				<div class="col-sm-3">
					<Words
						name="Etiology"
						bind:value={etiology}
						words={get_words.filter((e) => e.type === 'etiology')}
						modal_name="etiology"
					/>
				</div>
				<div class="col-sm-9">
					<input
						bind:value={etiology}
						name="etiology"
						type="text"
						class="form-control"
						id="etiology"
					/>
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="staff" class="col-sm-3 col-form-label">Staff</label>
				<div class="col-sm-9">
					<Select
						value={get_visit?.staff_id || get_progress_note?.staff_id || ''}
						name="staff_id"
						items={get_staffs.map((e) => ({ id: e.id, name: e.name }))}
					/>
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="department_id" class="col-sm-3 col-form-label">Department</label>
				<div class="col-sm-9">
					<Select
						value={get_visit?.department_id || get_progress_note?.department_id || ''}
						name="department_id"
						items={get_departments.map((e) => ({ id: e.id, name: e.department }))}
					/>
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="ward_id" class="col-sm-3 col-form-label">Ward/Room/Bed</label>
				<div class="col-sm-9">
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#add_bed_ipd"
						class="form-control text-start"
						>{#if find_bed}
							{find_bed?.ward?.ward},
							{find_bed?.room?.room}
							{find_bed?.room?.product?.products},
							{find_bed?.bed}
						{:else}
							Select Bed
						{/if}
					</button>
				</div>
			</div>
		</div>
		<div class="card-footer">
			<a href="/patient/all" class="btn btn-light"><i class="fas fa-undo"></i> Cancel</a>
			<div class="float-end">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
