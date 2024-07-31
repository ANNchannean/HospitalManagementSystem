<script lang="ts">
	import { page } from '$app/stores';
	import { dobToAge } from '$lib/helper';
	import type { LayoutServerData } from './$types';
	let visit_id = $page.params.id;
	export let data: LayoutServerData;
	$: ({ get_visit } = data);
</script>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				{#if get_visit.progress_note_id}
					<span
						><a
							href="/ipd/{get_visit.progress_note_id}/progress-note"
							class="text-light btn btn-primary"
							><i class="fa-solid fa-rotate-left"></i>
							Back
						</a></span
					>
				{:else}
					<span
						><a href="/patient/opd" class="text-light btn btn-primary"
							><i class="fa-solid fa-rotate-left"></i>
							Back
						</a></span
					>
				{/if}
				<span class="fs-5"
					># Patient Infomation, ID Patient #{get_visit.patient_id} / ID Visit #{get_visit.id}
				</span>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table text-nowrap table-borderless">
					<thead class="">
						<tr>
							<td>Date</td>
							<td>
								{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
									.format(new Date(get_visit.date_checkup ?? ''))
									.split('/')
									.join('-')}
							</td>
							<td>Hour</td>
							<td
								>{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(
									new Date(get_visit.date_checkup ?? '')
								)}</td
							>
							<td></td>
						</tr>
						<tr>
							<td>Type</td>
							<td>{get_visit.checkin_type ?? ''}</td>
							<td>Ward/Room/Bed</td>
							<td> ... </td>

							<td></td>
						</tr>
						<tr>
							<td>Patient</td>
							<td>{get_visit.patient?.name_khmer},{get_visit.patient?.name_latin}</td>
							<td>Gender</td>
							<td
								>{get_visit.patient?.gender}, អាយុ {dobToAge({
									d: new Date(get_visit.patient?.dob ?? '').getDate(),
									m: new Date(get_visit.patient?.dob ?? '').getMonth() + 1,
									y: new Date(get_visit.patient?.dob ?? '').getFullYear(),
									date: new Date(get_visit?.date_checkup ?? '')
								}).y} ឆ្នាំ ,
								{dobToAge({
									d: new Date(get_visit.patient?.dob ?? '').getDate(),
									m: new Date(get_visit.patient?.dob ?? '').getMonth() + 1,
									y: new Date(get_visit.patient?.dob ?? '').getFullYear(),
									date: new Date(get_visit?.date_checkup ?? '')
								}).m} ខែ ,
								{dobToAge({
									d: new Date(get_visit.patient?.dob ?? '').getDate(),
									m: new Date(get_visit.patient?.dob ?? '').getMonth() + 1,
									y: new Date(get_visit.patient?.dob ?? '').getFullYear(),
									date: new Date(get_visit?.date_checkup ?? '')
								}).d} ថ្ងៃ
							</td>
							<td></td>
						</tr>
						<tr>
							<td>Telephone</td>
							<td>{get_visit.patient?.telephone}</td>
							<td>Address</td>
							<td>
								{get_visit.patient?.village?.type}
								{get_visit.patient?.village?.name_khmer},
								{get_visit.patient?.commune?.type}
								{get_visit.patient?.commune?.name_khmer},
								{get_visit.patient?.district?.type}
								{get_visit.patient?.district?.name_khmer},
								{get_visit.patient?.provice?.type}
								{get_visit.patient?.provice?.name_khmer}
							</td>
							<td></td>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>

<div class="row py-3">
	<div data-sveltekit-noscroll class="col-sm-12">
		<a
			href="/opd/{visit_id}/subjective "
			class={$page.url.pathname.includes('subjective')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Subjective</a
		>
		<a
			href="/opd/{visit_id}/objective "
			class={$page.url.pathname.includes('objective')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Objective</a
		>
		<a
			href="/opd/{visit_id}/laboratory "
			class={$page.url.pathname.includes('laboratory')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Laboratory</a
		>
		<a
			href="/opd/{visit_id}/imagerie "
			class={$page.url.pathname.includes('imagerie')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Imagerie</a
		>
		<a
			href="/opd/{visit_id}/assessment "
			class={$page.url.pathname.includes('assessment')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Assessment</a
		>
		<a
			href="/opd/{visit_id}/prescription "
			class={$page.url.pathname.includes('prescription')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Prescription</a
		>
		<a
			href="/opd/{visit_id}/appointment "
			class={$page.url.pathname.includes('appointment')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Appointment</a
		>
		<a
			href="/opd/{visit_id}/remark "
			class={$page.url.pathname.includes('remark')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Remark</a
		>
		<a
			href="/opd/{visit_id}/service "
			class={$page.url.pathname.includes('service')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Services</a
		>
	</div>
</div>

<slot />
