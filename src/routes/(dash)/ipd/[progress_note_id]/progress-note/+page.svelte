<script lang="ts">
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import CreateVisitIpd from '$lib/coms-cu/CreateVisitIPD.svelte';
	import type { PageServerData } from './$types';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	import Athtml from '$lib/coms/Athtml.svelte';
	import { enhance } from '$app/forms';
	import ActivePrescription from '$lib/coms/ActivePrescription.svelte';
	import CurrencySimble from '$lib/coms/CurrencySimble.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	export let data: PageServerData;
	let visit_id: number;
	$: ({ get_progress_note, removeDuplicateDate, get_exams } = data);
</script>

<DeleteModal id={visit_id} action="?/delete_visit_ipd" />
<CreateVisitIpd {data} />

<div class="card-header">
	<div class="d-grid gap-2 d-md-flex justify-content-between">
		<button
			on:click={() => {}}
			type="button"
			class="btn btn-success"
			data-bs-toggle="modal"
			data-bs-target="#create_visit_ipd"
			><i class="fa-solid fa-square-plus"></i>
			New Progress note
		</button>
		<button
			on:click={() => {}}
			type="button"
			class="btn btn-danger"
			data-bs-toggle="modal"
			data-bs-target="#create-product"
		>
			Discharge
		</button>
	</div>
</div>
<br />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-body table-responsive p-0">
				{#each removeDuplicateDate || [] as { date_checkup }}
					{@const f_date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
						new Date(date_checkup ?? '')
					)}
					<table class="table table-bordered">
						<thead class="table-light table-active">
							<tr class="text-center">
								<td>
									<DateTimeFormat timeStyle={false} date={date_checkup} />
								</td>
								<td>Observation Medical or SAOP note</td>
								<td>Para-Clinic</td>
								<td>Treatment</td>
							</tr>
						</thead>
						<tbody>
							{#each get_progress_note?.visit || [] as item (item.id)}
								{@const find_old_visit = item}
								{@const total_laboratory =
									find_old_visit?.billing?.charge.find((e) => e.charge_on === 'laboratory')
										?.price || 0}
								{@const total_imagerie =
									find_old_visit?.billing?.charge.find((e) => e.charge_on === 'imagerie')?.price ||
									0}
								{@const total_prescription =
									find_old_visit?.billing?.charge.find((e) => e.charge_on === 'prescription')
										?.price || 0}
								{@const sort_laboraytor = find_old_visit?.laboratoryRequest.sort((a) => {
									if (a.product?.products.includes('CBC')) return -1;
									else return 1;
								})}
								{@const mean_arterial_pressure =
									(1 / 3) * Number(find_old_visit?.vitalSign?.sbp) +
									(2 / 3) * Number(find_old_visit?.vitalSign?.dbp)}
								{@const s_date = new Intl.DateTimeFormat('en-GB', {
									dateStyle: 'short'
								}).format(new Date(item.date_checkup ?? ''))}
								{#if f_date === s_date}
									<tr>
										<td class="p-2" style="width:10%;vertical-align:top;">
											<button
												type="button"
												class="btn btn-light btn-sm w-100 mb-2"
												data-bs-toggle="modal"
												data-bs-target="#create-product"
											>
												<DateTimeFormat dateStyle={false} date={item.date_checkup} />
											</button>
											<a
												href="/opd/{item?.id}/subjective"
												class="btn btn-outline-info btn-sm w-100 mb-2"
												><i class="fa-solid fa-file-pen"></i> Edit
											</a>
											<button
												type="button"
												on:click={() => (visit_id = item.id)}
												class="btn btn-outline-danger btn-sm w-100 mb-2"
												data-bs-toggle="modal"
												data-bs-target="#delete_modal"
												><i class="fa-solid fa-trash-can"></i> Delete
											</button>
											<button
												type="button"
												class="btn btn-outline-success btn-sm w-100"
												data-bs-toggle="modal"
												data-bs-target="#"
												><i class="fa-solid fa-print"></i> Print
											</button>
										</td>
										<td style="width: 30%;vertical-align:top;">
											<div class="">
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
																			{find_old_visit?.vitalSign?.sbp?.toFixed(0).concat(' /') ??
																				''}
																			{find_old_visit?.vitalSign?.dbp?.toFixed(0).concat(' mmHg') ??
																				''}
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
																			>{find_old_visit?.vitalSign?.pulse
																				?.toFixed(0)
																				.concat(' /min') ?? ''}</td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.t}
																	<tr>
																		<td style="width: 40%;">Temperature °C/td </td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			><Athtml
																				html={find_old_visit?.vitalSign?.t
																					?.toFixed(1)
																					.concat(' &deg;C') ?? ''}
																			/></td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.rr}
																	<tr>
																		<td style="width: 40%;">RR (min)</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			>{find_old_visit?.vitalSign?.rr?.toFixed(0).concat(' /min') ??
																				''}</td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.sp02}
																	<tr>
																		<td style="width: 40%;">SpO2 (%)</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			>{find_old_visit?.vitalSign?.sp02?.toFixed(0).concat(' %') ??
																				''}</td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.height}
																	<tr>
																		<td style="width: 40%;">Height (cm)</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			>{find_old_visit?.vitalSign?.height
																				?.toFixed(0)
																				.concat(' cm') ?? ''}</td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.weight}
																	<tr>
																		<td style="width: 40%;">Weight (kg)</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			>{find_old_visit?.vitalSign?.weight
																				?.toFixed(0)
																				.concat(' kg') ?? ''}</td
																		>
																	</tr>
																{/if}
																{#if find_old_visit.vitalSign?.bmi}
																	<tr>
																		<td style="width: 40%;">BMI</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;"
																			>{find_old_visit?.vitalSign?.bmi
																				?.toFixed(1)
																				.concat(' kg/m2') ?? ''}</td
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
														<span class="btn btn-success btn-sm mb-2 py-0"
															>History of Present illness</span
														>
														<Renderhtml
															value={find_old_visit.subjective?.history_of_present_illness ?? ''}
														/>
													</div>
												{/if}
												{#if find_old_visit.subjective}
													<div class="border rounded border-1 p-2 mb-2">
														<span class="btn btn-success btn-sm mb-2 py-0"
															>Past medicine history</span
														>
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
												{#each get_exams as exam (exam.id)}
													{@const physicals = exam.physical}
													{#if find_old_visit.physicalExam.some((e) => e.physical?.exam_id === exam.id)}
														<div class="border rounded border-1 p-2 mb-2">
															<span class="fs-6 text-decoration-underline text-primary"
																>{exam.examination ?? ''}</span
															>
															<table class="table table-sm">
																<thead>
																	{#each physicals as physical (physical.id)}
																		{#each find_old_visit.physicalExam as physical_exam (physical_exam.id)}
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
												{#if find_old_visit.service}
													<button class="btn btn-success btn-sm mb-2 py-0">Service</button>
												{/if}
												{#if find_old_visit.service}
													<div class="border rounded border-1 p-2 mb-2">
														<span class="fs-6 text-decoration-underline text-primary"
															>{find_old_visit.service.product?.products ?? ''}</span
														>
														<table class="table">
															<thead>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Surgeon</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol?.surgeon ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Assistant Surgeon</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol
																				?.assistant_surgeon ?? ''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Anesthetist</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol?.anesthetist ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Assistant Anesthetist</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol
																				?.assistant_anesthetist ?? ''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Scrub Nurse</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol?.scrub_nurse ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Circulation / Nurse block</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol
																				?.cirulating_nurse_block ?? ''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Midwife</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span class=""
																			>{find_old_visit.service.operationProtocol?.midwife ??
																				''}</span
																		>
																	</td>
																</tr>
																{#if find_old_visit.service.operationProtocol?.date}
																	<tr>
																		<td style="width: 40%;">
																			<span class="">Dates</span>
																		</td>
																		<td style="width: 5%;">:</td>
																		<td style="width:50%;">
																			<span class="">
																				<DateTimeFormat
																					timeStyle={false}
																					date={find_old_visit.service.operationProtocol.date}
																				/>
																			</span>
																		</td>
																	</tr>
																{/if}
																{#if find_old_visit.service.operationProtocol?.start_time}
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
																				value={find_old_visit.service.operationProtocol?.start_time.substring(
																					0,
																					5
																				)}
																				id=""
																			/>
																		</td>
																	</tr>
																{/if}
																{#if find_old_visit.service.operationProtocol?.finish_time}
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
																				value={find_old_visit.service.operationProtocol?.finish_time.substring(
																					0,
																					5
																				)}
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
																		<span
																			>{find_old_visit.service.operationProtocol?.pre_diagnosis ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Post Diagnosis</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span
																			>{find_old_visit.service.operationProtocol?.post_diagnosis ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Type Anesthesia</span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span
																			>{find_old_visit.service.operationProtocol?.type_anesthesia ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td colspan="3" class="text-wrap" style="width: 100%;">
																		<div>
																			<span class="">Opertive Technique</span>
																			<Renderhtml
																				value={find_old_visit.service.operationProtocol
																					?.opertive_technique ?? ''}
																			/>
																		</div>
																	</td>
																</tr>
																<tr>
																	<td style="width: 40%;">
																		<span class="">Blood Less </span>
																	</td>
																	<td style="width: 5%;">:</td>
																	<td style="width:50%;">
																		<span
																			>{find_old_visit.service.operationProtocol?.blood_less ??
																				''}</span
																		>
																	</td>
																</tr>
																<tr>
																	<td colspan="3" class="text-wrap" style="min-width: 100%;">
																		<div>
																			<span class="">Notes</span>
																			<Renderhtml
																				value={find_old_visit.service.operationProtocol?.notes ??
																					''}
																			/>
																		</div>
																	</td>
																</tr>
															</thead>
														</table>
													</div>
												{/if}
											</div>
										</td>
										<td style="width: 30%;vertical-align:top;">
											<div class="">
												{#if sort_laboraytor?.length}
													<button class="btn btn-success btn-sm mb-2 py-0">Laboratory</button>
												{/if}
												{#each sort_laboraytor || [] as laboratory_request (laboratory_request.id)}
													{@const laboratory_results = laboratory_request.laboratoryResult}
													{@const parameters = laboratory_request.product?.parameter}
													<div class="border rounded border-1 p-2 mb-2">
														<span class="fs-6 text-decoration-underline text-primary"
															>{laboratory_request.product?.products ?? ''}</span
														>
														<table class="table-sm table">
															<thead>
																{#each parameters || [] as parameter (parameter.id)}
																	<tr>
																		<td style="width: 40%;"> {parameter.parameter ?? ''}</td>
																		<td style="width: 5%;">:</td>
																		{#each laboratory_results as laboratory_result (laboratory_result.id)}
																			{#if laboratory_result.parameter_id === parameter.id}
																				<td style="width: 20%;">
																					{#if laboratory_result.result === 'Positive' || laboratory_result.result === '1/160' || laboratory_result.result === '1/320' || laboratory_result.result === '+' || laboratory_result.result === '++' || laboratory_result.result === '+++' || laboratory_result.result === '++++'}
																						<span style="color: #FF0000;">
																							{laboratory_result.result}
																						</span>
																					{:else if Number(laboratory_result.result) >= Number(parameter?.mini) && Number(laboratory_result.result) <= Number(parameter?.maxi)}
																						<span>{laboratory_result.result}</span>
																					{:else if Number(laboratory_result.result) < Number(parameter?.mini)}
																						<span style="color: #0000FF;"
																							>{laboratory_result.result} L</span
																						>
																					{:else if Number(laboratory_result.result) > Number(parameter?.maxi)}
																						<span style="color: #FF0000;"
																							>{laboratory_result.result} H</span
																						>
																					{:else}
																						<span style="color: #0000FF;">
																							{laboratory_result.result ?? ''}
																						</span>
																					{/if}
																				</td>
																			{/if}
																		{/each}

																		<td style="width: 15%;">
																			<Athtml html={parameter.unit?.unit ?? ''} />
																		</td>

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
																{#each find_old_visit.imagerieRequest as imagerie_request (imagerie_request.id)}
																	<tr>
																		<td style="width: 40%;">
																			<span class=""
																				>{imagerie_request.product?.products ?? ''}</span
																			>
																		</td>
																		<td style="width: 5%;">:</td>
																		<td style="width: 55%;">
																			<a
																				target="_blank"
																				class=""
																				href="/report/{imagerie_request.id}/imagerie">View</a
																			>
																		</td>
																	</tr>
																{/each}
															</thead>
														</table>
													</div>
												{/if}
											</div>
										</td>
										<td style="width: 30%;vertical-align:top;">
											<div>
												{#each find_old_visit.presrciption as item, index (item.id)}
													<div class="border rounded border-1 p-2 mb-2">
														<span class="fs-6 text-decoration-underline text-primary"
															>{index + 1}
															{item.product?.products ?? ''}
															{item.product?.generic_name
																? `, (  ${item.product?.generic_name ?? ''} )`
																: ''}
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
																		<div class="col">
																			{#if item.morning !== 0}
																				<ActivePrescription
																					activePresrciption={item?.activePresrciption.filter(
																						(e) => e.active_for === 'morning'
																					)}
																					active_for="morning"
																					prescription_id={item.id}
																				>
																					{item.morning}
																				</ActivePrescription>
																			{/if}
																			{#if item.noon !== 0}
																				<ActivePrescription
																					activePresrciption={item?.activePresrciption.filter(
																						(e) => e.active_for === 'noon'
																					)}
																					active_for="noon"
																					prescription_id={item.id}
																				>
																					{item.noon}
																				</ActivePrescription>
																			{/if}
																			{#if item.afternoon !== 0}
																				<ActivePrescription
																					activePresrciption={item?.activePresrciption.filter(
																						(e) => e.active_for === 'afternoon'
																					)}
																					active_for="afternoon"
																					prescription_id={item.id}
																				>
																					{item.afternoon}
																				</ActivePrescription>
																			{/if}
																			{#if item.evening !== 0}
																				<ActivePrescription
																					activePresrciption={item?.activePresrciption.filter(
																						(e) => e.active_for === 'evening'
																					)}
																					active_for="evening"
																					prescription_id={item.id}
																				>
																					{item.evening}
																				</ActivePrescription>
																			{/if}
																			{#if item.night !== 0}
																				<ActivePrescription
																					activePresrciption={item?.activePresrciption.filter(
																						(e) => e.active_for === 'night'
																					)}
																					active_for="night"
																					prescription_id={item.id}
																				>
																					{item.night}
																				</ActivePrescription>
																			{/if}
																		</div>
																	</td>
																</tr>
															</thead>
														</table>
													</div>
												{/each}
												{#if total_imagerie || total_laboratory || total_prescription}
													<div class="card">
														<div class="card-header">
															<div class="row">
																<div class="col">
																	<span class="fs-5">invoice Daily</span>
																</div>
																<div class="col text-end">
																	<a
																		href="/billing/single/{item.billing?.id}"
																		class="btn btn-warning btn-sm">Daily Payment</a
																	>
																</div>
															</div>
														</div>
														<div class="card-body">
															<table class="table">
																<thead>
																	{#if total_laboratory}
																		<tr>
																			<td>Total Laboratory </td>
																			<td>:</td>
																			<td>
																				<CurrencySimble value={total_laboratory} />
																			</td>
																		</tr>
																	{/if}
																	{#if total_imagerie}
																		<tr>
																			<td>Total Imagrie </td>
																			<td>:</td>
																			<td>
																				<CurrencySimble value={total_imagerie} />
																			</td>
																		</tr>
																	{/if}
																	{#if total_prescription}
																		<tr>
																			<td>Total Treatment </td>
																			<td>:</td>
																			<td>
																				<CurrencySimble value={total_prescription} />
																			</td>
																		</tr>
																	{/if}
																	<tr class="border text-bg-light">
																		<td>Total Daily </td>
																		<td>:</td>
																		<td>
																			<CurrencySimble
																				value={total_prescription +
																					total_imagerie +
																					total_laboratory}
																			/>
																		</td>
																	</tr>
																</thead>
															</table>
														</div>
													</div>
												{/if}
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</div>
	</div>
</div>
