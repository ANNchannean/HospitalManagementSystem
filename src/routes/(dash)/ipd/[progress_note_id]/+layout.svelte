<script lang="ts">
	import { page } from '$app/stores';
	import CheckOut from '$lib/coms-ipd/CheckOut.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { dobToAge } from '$lib/helper';
	import { _ } from '$lib/translations';
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
							{$_('back')}
						</a>
						<span
							>{$_('patient')} @{get_progress_note?.patient_id} / ID Visit #{get_progress_note?.id}
						</span>
					</div>
				</div>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table text-nowrap table-borderless">
					<thead class="">
						<tr>
							<td>{$_('date')}</td>
							<td>
								<DateTimeFormat timeStyle={false} date={get_progress_note?.date_checkup} />
							</td>
							<td>{$_('hour')}</td>
							<td>
								<DateTimeFormat dateStyle={false} date={get_progress_note?.date_checkup} />
							</td>
							<td></td>
						</tr>
						<tr>
							<td>{$_('visit_type')}</td>
							<td>{$_('ipd')}</td>
							<td>{$_('ward')}/{$_('room')}/{$_('bed')}</td>
							<td
								>{get_progress_note?.bed.ward?.ward},{get_progress_note?.bed.room
									?.room},{get_progress_note?.bed.bed}</td
							>

							<td></td>
						</tr>
						<tr>
							<td>{$_('patient')}</td>
							<td
								>{get_progress_note?.patient?.name_khmer},{get_progress_note?.patient
									?.name_latin}</td
							>
							<td>{$_('gender')}/{$_('age')}</td>
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
							<td>{$_('telephone')}</td>
							<td>{get_progress_note?.patient?.telephone}</td>
							<td>{$_('address')}</td>
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

<div class="row pt-2">
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
			href="/ipd/{progress_note_id}/prescription"
			class={$page.url.pathname.includes('prescription')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Prescription</a
		>
		<a
			href="/ipd/{progress_note_id}/appointment"
			class={$page.url.pathname.includes('appointment')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Appointment</a
		>

		<CheckOut class="btn btn-danger mb-2 float-end" data={{ get_progress_note: get_progress_note }}
			>{$_('discharge')}</CheckOut
		>
	</div>
</div>
<slot />
