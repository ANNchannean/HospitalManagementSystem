<script lang="ts">
	import { page } from '$app/stores';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	import Renderhtml from '$lib/components/etc/Renderhtml.svelte';
	import { dobToAge } from '$lib/helper';
	import type { LayoutServerData } from './$types';
	let visit_id = $page.params.id;
	export let data: LayoutServerData;
	$: ({ get_visit, get_visits, get_exams } = data);
	let old_visit_id = 0;
	$: find_old_visit = get_visits.find((e) => e.id === old_visit_id);
	$: sort_laboraytor = find_old_visit?.laboratoryRequest.sort((a) => {
		if (a.product?.products.includes('CBC')) return -1;
		else return 1;
	});
	$: mean_arterial_pressure =
		(1 / 3) * Number(find_old_visit?.vitalSign?.sbp) +
		(2 / 3) * Number(find_old_visit?.vitalSign?.dbp);
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
							<td>OPD</td>
							<td></td>
							<td> </td>

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
		<a
			href="/opd/{visit_id}/vaccine "
			class={$page.url.pathname.includes('vaccine')
				? 'btn btn-dark mb-2'
				: 'btn btn-outline-dark mb-2'}>Vaccine</a
		>
	</div>
</div>

<slot />

{#if !get_visit.progress_note_id}
	<hr />

	<div class="row">
		{#each get_visits as item}
			<div class="col-auto">
				<button
					on:click={() => {
						if (old_visit_id === item.id) {
							old_visit_id = 0;
						} else {
							old_visit_id = 0;
							old_visit_id = item.id;
						}
					}}
					class="btn mb-3"
					class:btn-outline-primary={old_visit_id !== item.id}
					class:btn-primary={old_visit_id === item.id}
					>{item?.checkin_type}
					{new Intl.DateTimeFormat('en-GB', {
						dateStyle: 'short',
						timeStyle: 'short',
						hour12: true
					}).format(Date.parse(item.date_checkup))}
					{item?.id ?? ''}
				</button>
			</div>
		{/each}
	</div>
{/if}
{#if find_old_visit}
	<div style="font-size: 90%;" class="table-responsive">
		<table class="table table-bordered">
			<thead>
				<tr>
					<td style="width: 33.33%; vertical-align: top;">
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary">VitalSign</span>
							<table class="table table-sm">
								<thead>
									<tr>
										<td style="width: 40%;">BP(mmHg)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.sbp?.toFixed(0).concat(' /') ?? ''}
											{find_old_visit?.vitalSign?.dbp?.toFixed(0).concat(' mmHg') ?? ''}
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">MAP</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{mean_arterial_pressure
												? mean_arterial_pressure?.toFixed(0).concat(' mmHg')
												: ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">Pulse (min)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.pulse?.toFixed(0).concat(' /min') ?? ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">Temperature °C/td </td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											><Athtml
												html={find_old_visit?.vitalSign?.t?.toFixed(1).concat(' &deg;C') ?? ''}
											/></td
										>
									</tr>
									<tr>
										<td style="width: 40%;">RR (min)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.rr?.toFixed(0).concat(' /min') ?? ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">SpO2 (%)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.sp02?.toFixed(0).concat(' %') ?? ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">Height (cm)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.height?.toFixed(0).concat(' cm') ?? ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">Weight (kg)</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.weight?.toFixed(0).concat(' kg') ?? ''}</td
										>
									</tr>
									<tr>
										<td style="width: 40%;">BMI</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.bmi?.toFixed(1).concat(' kg/m2') ?? ''}</td
										>
									</tr>
								</thead>
							</table>
						</div>
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary">Cheif complaint</span>
							<Athtml html={find_old_visit.subjective?.cheif_complaint ?? ''} />
						</div>
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary"
								>History of Present illness</span
							>
							<Athtml html={find_old_visit.subjective?.history_of_present_illness ?? ''} />
						</div>
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary">Past medicine history</span>
							<table class="table-sm table">
								<thead>
									<tr>
										<td style="width: 40%;"> Current Medication</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;">
											{find_old_visit.subjective?.current_medication ?? ''}
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">Past medical history</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;">
											{find_old_visit.subjective?.past_medical_history ?? ''}
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">Allergy medicine</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;">
											{find_old_visit.subjective?.allesgy_medicine ?? ''}
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">Surgical history</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;">
											{find_old_visit.subjective?.surgical_history ?? ''}
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">Family and social history</td>
										<td style="width: 10%;">:</td>
										<td style="width: 20%;">
											{find_old_visit.subjective?.family_and_social_history ?? ''}
										</td>
									</tr>
								</thead>
							</table>
						</div>
						{#each get_exams as exam, index}
							{@const physicals = exam.physical}
							{#if find_old_visit.physicalExam.some((e) => e.physical?.exam_id === exam.id)}
								<div class="border rounded border-1 p-2 mb-2">
									<span class="fs-6 text-decoration-underline text-primary"
										>{index + 1} {exam.examination ?? ''}</span
									>
									<table class=" table table-sm">
										<thead>
											{#each physicals as physical}
												{#each find_old_visit.physicalExam as physical_exam}
													{#if physical_exam.physical_id === physical.id}
														<tr>
															<td style="width: 40%;"> {physical.physical}</td>
															<td style="width: 10%;">:</td>
															<td style="width: 20%;">
																{physical_exam.result ?? ''}
															</td>
														</tr>
													{/if}
												{/each}
											{/each}
										</thead>
									</table>
								</div>
							{/if}
						{/each}
					</td>
					<td style="width: 33.33%;vertical-align: top;">
						{#each sort_laboraytor || [] as laboratory_request}
							{@const laboratory_results = laboratory_request.laboratoryResult}
							{@const parameters = laboratory_request.product?.parameter}

							<div class="border rounded border-1 p-2 mb-2">
								<span class="fs-6 text-decoration-underline text-primary"
									>{laboratory_request.product?.products ?? ''}</span
								>
								<table class="table-sm table">
									<thead>
										{#each parameters || [] as parameter}
											<tr>
												<td style="width: 40%;"> {parameter.parameter ?? ''}</td>
												<td style="width: 10%;">:</td>
												{#each laboratory_results as laboratory_result}
													{#if laboratory_result.parameter_id === parameter.id}
														<td style="width: 15%;">
															{#if laboratory_result.result === 'Positive' || laboratory_result.result === '1/160' || laboratory_result.result === '1/320' || laboratory_result.result === '+' || laboratory_result.result === '++' || laboratory_result.result === '+++' || laboratory_result.result === '++++'}
																<span style="color: #FF0000;">
																	{laboratory_result.result}
																</span>
															{:else if Number(laboratory_result.result) >= Number(parameter?.mini) && Number(laboratory_result.result) <= Number(parameter?.maxi)}
																<span>{laboratory_result.result}</span>
															{:else if Number(laboratory_result.result) < Number(parameter?.mini)}
																<span style="color: #0000FF;">{laboratory_result.result} L</span>
															{:else if Number(laboratory_result.result) > Number(parameter?.maxi)}
																<span style="color: #FF0000;">{laboratory_result.result} H</span>
															{:else}
																<span style="color: #0000FF;">
																	{laboratory_result.result}
																</span>
															{/if}
														</td>
													{/if}
												{/each}

												<td style="width: 15%;"> <Athtml html={parameter.unit?.unit ?? ''} /> </td>

												<td style="width: 20%;">
													{parameter.mini === 0 ? '' : `( ${parameter.mini}`}
													{parameter.sign ?? ''}
													{parameter.maxi === 0 ? '' : `${parameter.maxi} )`}
												</td>
											</tr>
										{/each}
									</thead>
								</table>
							</div>
						{/each}
						{#each find_old_visit.imagerieRequest as imagerie_request}
							<div class="border rounded border-1 p-2 mb-2">
								<table class="table">
									<thead>
										<tr>
											<td style="width: 80%;">
												<span class="fs-6 text-decoration-underline text-primary"
													>{imagerie_request.product?.products ?? ''}</span
												>
											</td>
											<td style="width: 20;">
												<a
													target="_blank"
													class="fs-6 text-decoration-underline text-primary"
													href="/report/{imagerie_request.id}/imagerie">View</a
												>
											</td>
										</tr>
									</thead>
								</table>
							</div>
						{/each}
					</td>
					<td style="width: 33.33%;vertical-align: top;">
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary">Doctor's Comment</span>
							<Renderhtml value={find_old_visit.remark?.description ?? ''} />
						</div>
					</td>
					<td style="width: 33.33%;vertical-align: top;">
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary">Doctor's Comment</span>
							<Renderhtml value={find_old_visit.remark?.description ?? ''} />
						</div>
					</td>
				</tr>
			</thead>
		</table>
	</div>
{/if}
