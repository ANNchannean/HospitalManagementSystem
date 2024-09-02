<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/progress-note/$types';
	import Athtml from '$lib/coms/Athtml.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	type TVisit = Pick<PageServerData, 'visit'>;
	type VisitProperties = TVisit['visit'] extends undefined ? never : TVisit['visit'];
	type TExam = Pick<PageServerData, 'get_exams'>;
	type VExamProperties = TExam['get_exams'] extends undefined ? never : TExam['get_exams'];
	export let find_old_visit: VisitProperties;
	export let get_exams: VExamProperties;
	$: mean_arterial_pressure =
		(1 / 3) * Number(find_old_visit?.vitalSign?.sbp) +
		(2 / 3) * Number(find_old_visit?.vitalSign?.dbp);
</script>

<div class="">
	{#if find_old_visit?.vitalSign}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">VitalSign</span>
			<table class="table table-sm">
				<thead>
					{#if find_old_visit?.vitalSign?.sbp}
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
									{mean_arterial_pressure ? mean_arterial_pressure?.toFixed(0).concat(' mmHg') : ''}
								{/if}
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.pulse}
						<tr>
							<td style="width: 40%;">Pulse (min)</td>
							<td style="width: 5%;">:</td>
							<td style="width: 20%;"
								>{find_old_visit?.vitalSign?.pulse?.toFixed(0).concat(' /min') ?? ''}</td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.t}
						<tr>
							<td style="width: 40%;">Temperature °C/td </td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;"
								><Athtml
									html={find_old_visit?.vitalSign?.t?.toFixed(1).concat(' &deg;C') ?? ''}
								/></td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.rr}
						<tr>
							<td style="width: 40%;">RR (min)</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;"
								>{find_old_visit?.vitalSign?.rr?.toFixed(0).concat(' /min') ?? ''}</td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.sp02}
						<tr>
							<td style="width: 40%;">SpO2 (%)</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;"
								>{find_old_visit?.vitalSign?.sp02?.toFixed(0).concat(' %') ?? ''}</td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.height}
						<tr>
							<td style="width: 40%;">Height (cm)</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;"
								>{find_old_visit?.vitalSign?.height?.toFixed(0).concat(' cm') ?? ''}</td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.weight}
						<tr>
							<td style="width: 40%;">Weight (kg)</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;"
								>{find_old_visit?.vitalSign?.weight?.toFixed(0).concat(' kg') ?? ''}</td
							>
						</tr>
					{/if}
					{#if find_old_visit?.vitalSign?.bmi}
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
	{#if find_old_visit?.subjective?.cheif_complaint}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Cheif complaint</span>
			<Renderhtml value={find_old_visit?.subjective?.cheif_complaint ?? ''} />
		</div>
	{/if}
	{#if find_old_visit?.subjective?.history_of_present_illness}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">History of Present illness</span>
			<Renderhtml value={find_old_visit?.subjective?.history_of_present_illness ?? ''} />
		</div>
	{/if}
	{#if find_old_visit?.subjective}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Past medicine history</span>
			<table class="table-sm table">
				<thead>
					{#if find_old_visit?.subjective?.current_medication}
						<tr>
							<td style="width: 40%;"> Current Medication</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								{find_old_visit?.subjective?.current_medication ?? ''}
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.subjective?.past_medical_history}
						<tr>
							<td style="width: 40%;">Past medical history</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								{find_old_visit?.subjective?.past_medical_history ?? ''}
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.subjective?.allesgy_medicine}
						<tr>
							<td style="width: 40%;">Allergy medicine</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								{find_old_visit?.subjective?.allesgy_medicine ?? ''}
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.subjective?.surgical_history}
						<tr>
							<td style="width: 40%;">Surgical history</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								{find_old_visit?.subjective?.surgical_history ?? ''}
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.subjective?.family_and_social_history}
						<tr>
							<td style="width: 40%;">Family and social history</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								{find_old_visit?.subjective?.family_and_social_history ?? ''}
							</td>
						</tr>
					{/if}
				</thead>
			</table>
		</div>
	{/if}
	{#if find_old_visit?.physicalExam.length}
		<button class="btn btn-success btn-sm mb-2 py-0">Physical Exam</button>
	{/if}
	{#each get_exams || [] as exam (exam.id)}
		{@const physicals = exam.physical}
		{#if find_old_visit?.physicalExam.some((e) => e.physical?.exam_id === exam.id)}
			<div class="border rounded border-1 p-2 mb-2">
				<span class="fs-6 text-decoration-underline text-primary">{exam.examination ?? ''}</span>
				<table class="table table-sm">
					<thead>
						{#each physicals as physical (physical.id)}
							{#each find_old_visit?.physicalExam || [] as physical_exam (physical_exam.id)}
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
	{#if find_old_visit?.accessment}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Diagnosis</span>
			<p>
				{find_old_visit?.accessment.diagnosis_or_problem ?? ''}
			</p>
		</div>
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Differential </span>
			<p>
				{find_old_visit?.accessment.differential_diagnosis ?? ''}
			</p>
		</div>
	{/if}
	{#if find_old_visit?.remark?.description}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Doctor's Comment</span>
			<Renderhtml value={find_old_visit?.remark?.description ?? ''} />
		</div>
	{/if}
	{#if find_old_visit?.service}
		<button class="btn btn-success btn-sm mb-2 py-0">Service</button>
	{/if}
	{#if find_old_visit?.service}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="fs-6 text-decoration-underline text-primary"
				>{find_old_visit?.service.product?.products ?? ''}</span
			>
			<table class="table">
				<thead>
					<tr>
						<td style="width: 40%;">
							<span class="">Surgeon</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class="">{find_old_visit?.service.operationProtocol?.surgeon ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Assistant Surgeon</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class=""
								>{find_old_visit?.service.operationProtocol?.assistant_surgeon ?? ''}</span
							>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Anesthetist</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class="">{find_old_visit?.service.operationProtocol?.anesthetist ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Assistant Anesthetist</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class=""
								>{find_old_visit?.service.operationProtocol?.assistant_anesthetist ?? ''}</span
							>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Scrub Nurse</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class="">{find_old_visit?.service.operationProtocol?.scrub_nurse ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Circulation / Nurse block</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class=""
								>{find_old_visit?.service.operationProtocol?.cirulating_nurse_block ?? ''}</span
							>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Midwife</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span class="">{find_old_visit?.service.operationProtocol?.midwife ?? ''}</span>
						</td>
					</tr>
					{#if find_old_visit?.service.operationProtocol?.date}
						<tr>
							<td style="width: 40%;">
								<span class="">Dates</span>
							</td>
							<td style="width: 5%;">:</td>
							<td style="width:50%;">
								<span class="">
									<DateTimeFormat
										timeStyle={false}
										date={find_old_visit?.service.operationProtocol.date}
									/>
								</span>
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.service.operationProtocol?.start_time}
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
									value={find_old_visit?.service.operationProtocol?.start_time.substring(0, 5)}
									id=""
								/>
							</td>
						</tr>
					{/if}
					{#if find_old_visit?.service.operationProtocol?.finish_time}
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
									value={find_old_visit?.service.operationProtocol?.finish_time.substring(0, 5)}
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
							<span>{find_old_visit?.service.operationProtocol?.pre_diagnosis ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Post Diagnosis</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span>{find_old_visit?.service.operationProtocol?.post_diagnosis ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td style="width: 40%;">
							<span class="">Type Anesthesia</span>
						</td>
						<td style="width: 5%;">:</td>
						<td style="width:50%;">
							<span>{find_old_visit?.service.operationProtocol?.type_anesthesia ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td colspan="3" class="text-wrap" style="width: 100%;">
							<div>
								<span class="">Opertive Technique</span>
								<Renderhtml
									value={find_old_visit?.service.operationProtocol?.opertive_technique ?? ''}
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
							<span>{find_old_visit?.service.operationProtocol?.blood_less ?? ''}</span>
						</td>
					</tr>
					<tr>
						<td colspan="3" class="text-wrap" style="min-width: 100%;">
							<div>
								<span class="">Notes</span>
								<Renderhtml value={find_old_visit?.service.operationProtocol?.notes ?? ''} />
							</div>
						</td>
					</tr>
				</thead>
			</table>
		</div>
	{/if}
</div>
