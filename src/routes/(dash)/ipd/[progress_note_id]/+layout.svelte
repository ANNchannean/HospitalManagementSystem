<script lang="ts">
	import { page } from '$app/stores';
	import { dobToAge } from '$lib/helper';
	import type { LayoutServerData } from './$types';
	let progress_note_id = $page.params.progress_note_id;
	export let data: LayoutServerData;
	$: ({ get_progress_note } = data);
	$: age_p_visit = dobToAge({
		dob: get_progress_note!.patient.dob,
		date: get_progress_note!.date_checkup
	});
</script>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header fs-5">
				<div class="row">
					<div class="col-auto">
						<a href="/patient/ipd" class="text-light btn btn-primary"
							><i class="fa-solid fa-rotate-left"></i>
							Back
						</a>
						<span
							># Patient Infomation, ID Patient #{get_progress_note?.patient_id} / ID Visit #{get_progress_note?.id}
						</span>
					</div>
				</div>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table text-nowrap table-borderless">
					<thead class="">
						<tr>
							<td>Date</td>
							<td>
								{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
									.format(new Date(get_progress_note?.date_checkup ?? ''))
									.split('/')
									.join('-')}
							</td>
							<td>Hour</td>
							<td
								>{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(
									new Date(get_progress_note?.date_checkup ?? '')
								)}</td
							>
							<td></td>
						</tr>
						<tr>
							<td>Type</td>
							<td>IPD</td>
							<td>Ward/Room/Bed</td>
							<td
								>{get_progress_note?.bed.ward?.ward},{get_progress_note?.bed.room
									?.room},{get_progress_note?.bed.bed}</td
							>

							<td></td>
						</tr>
						<tr>
							<td>Patient</td>
							<td
								>{get_progress_note?.patient?.name_khmer},{get_progress_note?.patient
									?.name_latin}</td
							>
							<td>Gender</td>
							<td>
								{#if get_progress_note?.patient.dob}
									{get_progress_note?.patient?.gender}, អាយុ {age_p_visit?.y ?? ''} ឆ្នាំ ,
									{age_p_visit?.m ?? ''} ខែ ,
									{age_p_visit?.d ?? ''} ថ្ងៃ
								{/if}
							</td>
							<td></td>
						</tr>
						<tr>
							<td>Telephone</td>
							<td>{get_progress_note?.patient?.telephone}</td>
							<td>Address</td>
							<td>
								{get_progress_note?.patient?.village?.type}
								{get_progress_note?.patient?.village?.name_khmer},
								{get_progress_note?.patient?.commune?.type}
								{get_progress_note?.patient?.commune?.name_khmer},
								{get_progress_note?.patient?.district?.type}
								{get_progress_note?.patient?.district?.name_khmer},
								{get_progress_note?.patient?.provice?.type}
								{get_progress_note?.patient?.provice?.name_khmer}
							</td>
							<td></td>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>
<br />
<div class="row">
	<div data-sveltekit-noscroll class="col-sm-12">
		<a
			href="/ipd/{progress_note_id}/progress-note "
			class={$page.url.pathname.includes('progress-note')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Progress Note</a
		>
		<a
			href="/ipd/{progress_note_id}/nursing-process"
			class={$page.url.pathname.includes('nursing-process')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Nursing Process</a
		>
		<a
			href="/ipd/{progress_note_id}/vital-sign "
			class={$page.url.pathname.includes('vital-sign')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Vital Sign</a
		>
		<a
			href="/ipd/{progress_note_id}/service "
			class={$page.url.pathname.includes('service')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Services</a
		>
		<a
			href="/ipd/{progress_note_id}/assessment "
			class={$page.url.pathname.includes('assessment')
				? 'btn btn-dark mb-2'
				: 'btn btn btn-outline-dark mb-2'}>Assessment</a
		>
		<a
			href="/ipd/{progress_note_id}/discharge-summary"
			class={$page.url.pathname.includes('discharge-summary')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Discharge Summary</a
		>
		<a
			href="/ipd/{progress_note_id}/appointment"
			class={$page.url.pathname.includes('appointment')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Appointment</a
		>
	</div>
</div>

<slot />
