<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Athtml from '$lib/coms/Athtml.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
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
	$: age_p_visit = dobToAge({ dob: get_visit.patient.dob, date: get_visit.date_checkup });
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
								<DateTimeFormat timeStyle={false} date={get_visit.date_checkup} />
							</td>
							<td>Hour</td>
							<td>
								<DateTimeFormat dateStyle={false} date={get_visit.date_checkup} />
							</td>
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
								>{get_visit.patient?.gender}, អាយុ {age_p_visit?.y} ឆ្នាំ ,
								{age_p_visit?.m} ខែ ,
								{age_p_visit?.d} ថ្ងៃ
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
						invalidateAll();
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
					<DateTimeFormat date={item.date_checkup} />
					{item?.id ?? ''}
				</button>
			</div>
		{/each}
	</div>
{/if}
{#if find_old_visit}
	<div class="card">
		<div class="card-header">
			<span class="fs-5">SAOP</span>
		</div>
		<div style="font-size: 90%" class="row card-body">
			<div class="col-sm-4">
				<h4 class="text-center">Observation note</h4>
				{#if find_old_visit.vitalSign}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">VitalSign</span>
						<table class="table table-sm">
							<thead>
								{#if find_old_visit.vitalSign?.sbp}
									<tr>
										<td style="width: 40%;">BP(mmHg)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit?.vitalSign?.sbp?.toFixed(0).concat(' /') ?? ''}
											{find_old_visit?.vitalSign?.dbp?.toFixed(0).concat(' mmHg') ?? ''}
										</td>
									</tr>
								{/if}
								{#if mean_arterial_pressure}
									<tr>
										<td style="width: 40%;">MAP</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{#if mean_arterial_pressure}
												{mean_arterial_pressure
													? mean_arterial_pressure?.toFixed(0).concat(' mmHg')
													: ''}
											{/if}
										</td>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.pulse}
									<tr>
										<td style="width: 40%;">Pulse (min)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 20%;"
											>{find_old_visit?.vitalSign?.pulse?.toFixed(0).concat(' /min') ?? ''}</td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.t}
									<tr>
										<td style="width: 40%;">Temperature °C </td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											><Athtml
												html={find_old_visit?.vitalSign?.t?.toFixed(1).concat(' &deg;C') ?? ''}
											/></td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.rr}
									<tr>
										<td style="width: 40%;">RR (min)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											>{find_old_visit?.vitalSign?.rr?.toFixed(0).concat(' /min') ?? ''}</td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.sp02}
									<tr>
										<td style="width: 40%;">SpO2 (%)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											>{find_old_visit?.vitalSign?.sp02?.toFixed(0).concat(' %') ?? ''}</td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.height}
									<tr>
										<td style="width: 40%;">Height (cm)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											>{find_old_visit?.vitalSign?.height?.toFixed(0).concat(' cm') ?? ''}</td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.weight}
									<tr>
										<td style="width: 40%;">Weight (kg)</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											>{find_old_visit?.vitalSign?.weight?.toFixed(0).concat(' kg') ?? ''}</td
										>
									</tr>
								{/if}
								{#if find_old_visit.vitalSign?.bmi}
									<tr>
										<td style="width: 40%;">BMI</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;"
											>{find_old_visit?.vitalSign?.bmi?.toFixed(1).concat(' kg/m2') ?? ''}</td
										>
									</tr>
								{/if}
							</thead>
						</table>
					</div>
				{/if}
				{#if find_old_visit.subjective?.cheif_complaint}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Cheif complaint</span>
						<Renderhtml value={find_old_visit.subjective?.cheif_complaint ?? ''} />
					</div>
				{/if}
				{#if find_old_visit.subjective?.history_of_present_illness}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">History of Present illness</span>
						<Renderhtml value={find_old_visit.subjective?.history_of_present_illness ?? ''} />
					</div>
				{/if}
				{#if find_old_visit.subjective}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Past medicine history</span>
						<table class="table-sm table">
							<thead>
								{#if find_old_visit.subjective?.current_medication}
									<tr>
										<td style="width: 40%;"> Current Medication</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit.subjective?.current_medication ?? ''}
										</td>
									</tr>
								{/if}
								{#if find_old_visit.subjective?.past_medical_history}
									<tr>
										<td style="width: 40%;">Past medical history</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit.subjective?.past_medical_history ?? ''}
										</td>
									</tr>
								{/if}
								{#if find_old_visit.subjective?.allesgy_medicine}
									<tr>
										<td style="width: 40%;">Allergy medicine</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit.subjective?.allesgy_medicine ?? ''}
										</td>
									</tr>
								{/if}
								{#if find_old_visit.subjective?.surgical_history}
									<tr>
										<td style="width: 40%;">Surgical history</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit.subjective?.surgical_history ?? ''}
										</td>
									</tr>
								{/if}
								{#if find_old_visit.subjective?.family_and_social_history}
									<tr>
										<td style="width: 40%;">Family and social history</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											{find_old_visit.subjective?.family_and_social_history ?? ''}
										</td>
									</tr>
								{/if}
							</thead>
						</table>
					</div>
				{/if}
				{#if find_old_visit.physicalExam.length}
					<button class="btn btn-success btn-sm mb-2 py-0">Physical Exam</button>
				{/if}
				{#each get_exams as exam}
					{@const physicals = exam.physical}
					{#if find_old_visit.physicalExam.some((e) => e.physical?.exam_id === exam.id)}
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary"
								>{exam.examination ?? ''}</span
							>
							<table class="table table-sm">
								<thead>
									{#each physicals as physical}
										{#each find_old_visit.physicalExam as physical_exam}
											{#if physical_exam.physical_id === physical.id}
												{#if physical_exam.result}
													<tr>
														<td style="width: 40%;"> {physical.physical}</td>
														<td style="width: 5%;">:</td>
														<td style="width: 55%;">
															{physical_exam.result ?? ''}
														</td>
													</tr>
												{/if}
											{/if}
										{/each}
									{/each}
								</thead>
							</table>
						</div>
					{/if}
				{/each}
				{#if find_old_visit.accessment}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Diagnosis</span>
						<p>
							{find_old_visit.accessment.diagnosis_or_problem ?? ''}
						</p>
					</div>
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Differential </span>
						<p>
							{find_old_visit.accessment.differential_diagnosis ?? ''}
						</p>
					</div>
				{/if}
				{#if find_old_visit.remark?.description}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Doctor's Comment</span>
						<Renderhtml value={find_old_visit.remark?.description ?? ''} />
					</div>
				{/if}
				{#if find_old_visit.service.length}
					<button class="btn btn-success btn-sm mb-2 py-0">Service</button>
				{/if}
				{#if find_old_visit?.service.length}
					{#each find_old_visit.service || [] as item (item.id)}
						<div class="border rounded border-1 p-2 mb-2">
							<span class="fs-6 text-decoration-underline text-primary"
								>{item.product?.products ?? ''}</span
							>
							<table class="table">
								<thead>
									<tr>
										<td style="width: 40%;">
											<span class="">Surgeon</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.surgeon ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Assistant Surgeon</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.assistant_surgeon ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Anesthetist</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.anesthetist ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Assistant Anesthetist</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.assistant_anesthetist ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Scrub Nurse</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.scrub_nurse ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Circulation / Nurse block</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.cirulating_nurse_block ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Midwife</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span class="">{item?.operationProtocol?.midwife ?? ''}</span>
										</td>
									</tr>
									{#if item?.operationProtocol?.date}
										<tr>
											<td style="width: 40%;">
												<span class="">Dates</span>
											</td>
											<td style="width: 5%;">:</td>
											<td style="width:50%;">
												<span class="">
													<DateTimeFormat timeStyle={false} date={item?.operationProtocol.date} />
												</span>
											</td>
										</tr>
									{/if}
									{#if item?.operationProtocol?.start_time}
										<tr>
											<td style="width: 40%;">
												<span class="">StartTime</span>
											</td>
											<td style="width: 5%;">:</td>
											<td style="width:50%;">
												<input
													class="text-bg-danger"
													disabled
													type="time"
													name=""
													value={item?.operationProtocol?.start_time.substring(0, 5)}
													id=""
												/>
											</td>
										</tr>
									{/if}
									{#if item?.operationProtocol?.finish_time}
										<tr>
											<td style="width: 40%;">
												<span class="">FinishTime</span>
											</td>
											<td style="width: 5%;">:</td>
											<td style="width:50%;">
												<input
													disabled
													class="text-bg-primary"
													type="time"
													name=""
													value={item?.operationProtocol?.finish_time.substring(0, 5)}
													id=""
												/>
											</td>
										</tr>
									{/if}
									<tr>
										<td style="width: 40%;">
											<span class="">Pre-Diagnosis</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span>{item?.operationProtocol?.pre_diagnosis ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Post Diagnosis</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span>{item?.operationProtocol?.post_diagnosis ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Type Anesthesia</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span>{item?.operationProtocol?.type_anesthesia ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td colspan="3" class="text-wrap" style="width: 100%;">
											<div>
												<span class="">Opertive Technique</span>
												<Renderhtml value={item?.operationProtocol?.opertive_technique ?? ''} />
											</div>
										</td>
									</tr>
									<tr>
										<td style="width: 40%;">
											<span class="">Blood Less </span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width:50%;">
											<span>{item?.operationProtocol?.blood_less ?? ''}</span>
										</td>
									</tr>
									<tr>
										<td colspan="3" class="text-wrap" style="min-width: 100%;">
											<div>
												<span class="">Notes</span>
												<Renderhtml value={item?.operationProtocol?.notes ?? ''} />
											</div>
										</td>
									</tr>
								</thead>
							</table>
						</div>
					{/each}
				{/if}
			</div>
			<div class="col-sm-4">
				<h4 class="text-center">Para-Clinic</h4>
				{#if sort_laboraytor?.length}
					<button class="btn btn-success btn-sm mb-2 py-0">Laboratory</button>
				{/if}
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
										<td style="width: 5%;">:</td>
										{#each laboratory_results as laboratory_result}
											{#if laboratory_result.parameter_id === parameter.id}
												<td style="width: 20%;">
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
															{laboratory_result.result ?? ''}
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

				{#if find_old_visit.imagerieRequest.length}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="btn btn-success btn-sm mb-2 py-0">Imagerie</span>
						<table class="table table-sm">
							<thead>
								{#each find_old_visit.imagerieRequest as imagerie_request}
									<tr>
										<td style="width: 40%;">
											<span class="">{imagerie_request.product?.products ?? ''}</span>
										</td>
										<td style="width: 5%;">:</td>
										<td style="width: 55%;">
											<a target="_blank" class="" href="/report/{imagerie_request.id}/imagerie"
												>View</a
											>
										</td>
									</tr>
								{/each}
							</thead>
						</table>
					</div>
				{/if}
			</div>
			<div class="col-sm-4">
				<h4 class="text-center">Treatment</h4>
				{#if find_old_visit.presrciption.length}
					<button class="btn btn-success btn-sm mb-2 py-0">Presrciption</button>
				{/if}
				{#each find_old_visit.presrciption as item, index}
					<div class="border rounded border-1 p-2 mb-2">
						<span class="fs-6 text-decoration-underline text-primary"
							>{index + 1}
							{item.product?.products ?? ''}
							{item.product?.generic_name ? `, (  ${item.product?.generic_name ?? ''} )` : ''}
						</span>,
						<span>
							ចំនួន {item.amount ?? ''}
							{item.product?.unit?.unit}, រយៈពេល {item.duration ?? ''}
						</span>
						<table class="table">
							<thead>
								<tr>
									<td style="width: 20%;">
										<span class="">{item.use ?? ''}</span>
									</td>
									<td style="width: 5%;">:</td>
									<td style="width: 55%;">
										<span class="badge text-bg-warning">
											{#if item.morning !== 0}
												Morning {item.morning}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.noon !== 0}
												Noon {item.noon}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.afternoon !== 0}
												Afternoon {item.afternoon}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.evening !== 0}
												Evening {item.evening}
											{/if}
										</span>
										<span class="badge text-bg-warning">
											{#if item.night !== 0}
												Night {item.night}
											{/if}
										</span>
									</td>
								</tr>
							</thead>
						</table>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
